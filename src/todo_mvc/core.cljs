(ns todo-mvc.core
  (:require
   [helix.core :as hx :refer [$ <>]]
   [applied-science.js-interop :as j]
   [helix.hooks :as hooks]
   [reseda.state :as state]
   [reseda.react :as reseda]
   [re-graph.core :as re-graph]
   [helix.dom :as d]
   ["../gen/Title.js" :refer (Title)]
   ["../gen/Loader.js" :refer (Loader)]
   ["../gen/Header.js" :refer (Header)]
   [todo-mvc.graphql :as graphql]
   [todo-mvc.components :as c]
   [todo-mvc.lib :refer [defnc]]
   ["@auth0/auth0-react" :refer [Auth0Provider useAuth0]]
   ["react" :as react]
   ["react-dom" :as rdom]
   ["react-router-dom" :as rr]))

(defonce backing-store (atom {}))
(defonce store (state/new-store backing-store))

(defn from-auth0
  [k]
  ;; because we are retrieving directly from the atom, this won't rerender any
  ;; components. but thats ok because auth0 state is only stored once on page
  ;; load
  (some-> @backing-store
          :auth0
          (j/get k)))

(defn user-sub
  [{:keys [data errors]}]
  (prn "d" (first (:user data)) errors)
  (swap! backing-store assoc :user (get-in data [:user 0])))

(def pages #js [ #js {:name "home"
                      :href "/"}])

(defnc TopMenu
  []
  (let [data (reseda/useStore store :userPromise)
        user (reseda/useStore store :user)
        errors (map #(apply str (.-message %)) (.-errors ^js @data))
        user-data (or (some-> user clj->js)
                      (j/get-in @data [:data :user 0]))]
    (when (seq errors)
      (js/console.error errors))
    ($ Header {:pages pages
               :user user-data
               :onLogout (from-auth0 :logout)})))

(defnc App
  []
  ($ rr/BrowserRouter
     (d/main
      {:class "py-16 mx-auto max-w-3xl"}
      (hx/suspense
       {:fallback ($ Header {:pages pages
                             :user #js {:email "Loading User..."}})}
       ($ TopMenu))
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
  [hasura-name]
  {:ws {:url (str "wss://" hasura-name ".hasura.app/v1/graphql")
        :supported-operations #{:subscribe :mutate}
        :connection-init-payload {"headers" {:authorization @graphql/token}}}
   :http {:url (str "https://" hasura-name ".hasura.app/v1/graphql")
          :impl {:headers {"Authorization" @graphql/token}}}})

(defn start-graphql-after-auth
  [res use-auth0]
  (when-let [jwt-id (j/get res "__raw")]
    (reset! graphql/token (str "Bearer " jwt-id))
    (swap! backing-store assoc
           :auth0 use-auth0
           :userPromise (-> (graphql/get-me (j/get-in use-auth0 [:user :sub]))
                            (reseda/suspending-value))
           :loaded? true)
    (re-graph/init (re-graph-config graphql/hasura-name))
    (re-graph/subscribe :me graphql/me-query {:id (j/get res :sub)} user-sub)))

(defn Auth0Wrap
  []
  (let [use-auth0 (useAuth0)
        login-with-redirect (.-loginWithRedirect use-auth0)
        is-authenticated? (.-isAuthenticated use-auth0)
        is-loading? (.-isLoading use-auth0)
        loaded? (reseda/useStore store :loaded?)
        loader ($ Loader {:title "Authenticating"})]
    (hooks/use-effect :auto-deps
                      (when (and (not is-authenticated?)
                                 (not is-loading?))
                        (login-with-redirect)))
    (cond
      (not (false? is-loading?))
      loader

      loaded?
      ($ App)

      is-authenticated?
      (do
        (.then ((.-getIdTokenClaims use-auth0))
               #(start-graphql-after-auth % use-auth0))
        loader)
      :else nil)))

(defn ^:export start
  []
  (rdom/render ($ Auth0Provider
                  {:domain "alexthings.eu.auth0.com"
                   :clientId "PdnRiEBHW2XYIk84c1AwmjyfPFzT5JI3"
                   :audience "hasura"
                   :redirectUri js/window.location.origin}
                  ($ Auth0Wrap)) (js/document.getElementById "app")))
