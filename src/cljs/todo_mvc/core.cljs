(ns todo-mvc.core
  (:require [helix.core :refer [$]]
            [todo-mvc.lib :refer [defnc]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            ["/jsviews/test" :refer [Test]]
            ["react-dom" :as rdom]))

;; define components using the `defnc` macro
(defnc greeting
  [{:keys [name]}]
  ;; use helix.dom to create DOM elements
  (d/div "Hello, " (d/strong name) "!"))

(defnc app []
  (let [[state set-state] (hooks/use-state {:name "Helix User"})]
    (d/div
     (d/h1 "Welcome!")
     ($ Test)
     ;; create elements out of components
     ($ greeting {:name (:name state)})
     (d/input {:value (:name state)
               :class "rounded-md"
               :on-change #(set-state assoc :name (.. % -target -value))}))))

(rdom/render ($ app) (js/document.getElementById "app"))
