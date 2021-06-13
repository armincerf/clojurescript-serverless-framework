(ns todo-mvc.core
  (:require
   [helix.core :as hx :refer [$ <>]]
   [applied-science.js-interop :as j]
   [helix.hooks :as hooks]
   [re-graph.core :as re-graph]
   [helix.dom :as d]
   ["../gen/Title.js" :refer (Title)]
   ["../gen/Loader.js" :refer (Loader)]
   ["../gen/Header.js" :refer (Header)]
   [todo-mvc.components :as c]
   [todo-mvc.lib :refer [defnc]]
   ["@auth0/auth0-react" :refer [Auth0Provider useAuth0]]
   ["react-dom" :as rdom]
   ["react-router-dom" :as rr]))

(defonce state (atom nil))

(defn from-auth0
  [k]
  (some-> @state
          :auth0
          (j/get k)))

(defnc App
  []
  ($ rr/BrowserRouter
     (d/main
      {:class "py-16 mx-auto max-w-3xl"}
      ($ Header {:pages #js [ #js {:name "home"
                                   :href "/"}]
                 :user (from-auth0 :user)
                 :onLogout (from-auth0 :logout)})
      (d/section
       {:class "todoapp"}
       (d/header
        {:class "header"}
        ($ Title {:label "Tasks"
                  :size "medium"
                  :primary true}))
       (c/todo-list))
      (c/app-footer))))

(defn re-graph-config
  [hasura-name jwt-id]
  {:ws {:url (str "wss://" hasura-name ".hasura.app/v1/graphql")
        :supported-operations #{:subscribe :mutate}
        :connection-init-payload {"headers" {:authorization (str "Bearer " jwt-id)}}}
   :http {:url (str "https://" hasura-name ".hasura.app/v1/graphql")
          :impl {:headers {"Authorization" (str "Bearer " jwt-id)}}}})

(defn start-graphql-after-auth
  [res]
  (when-let [jwt-id (j/get res "__raw")]
    (re-graph/init :hasura (re-graph-config "alx-todos" jwt-id))))

(defn Auth0Wrap
  []
  (let [use-auth0 (useAuth0)
        login-with-redirect (.-loginWithRedirect use-auth0)
        is-authenticated? (.-isAuthenticated use-auth0)
        is-loading? (.-isLoading use-auth0)]
    (hooks/use-effect :auto-deps
                      (when (and (not is-authenticated?)
                                 (not is-loading?))
                        (login-with-redirect)))
    (cond
      (not (false? is-loading?))
      ($ Loader {:title "Authenticating"})

      is-authenticated?
      (do
        (.then ((.-getIdTokenClaims use-auth0))
               #(start-graphql-after-auth %))
        (swap! state assoc :auth0 use-auth0)
        ($ App))
      :else nil)))

(defn ^:export start
  []
  (rdom/render ($ Auth0Provider
                  {:domain "alexthings.eu.auth0.com"
                   :clientId "PdnRiEBHW2XYIk84c1AwmjyfPFzT5JI3"
                   :audience "hasura"
                   :redirectUri js/window.location.origin}
                  ($ Auth0Wrap)) (js/document.getElementById "app")))
