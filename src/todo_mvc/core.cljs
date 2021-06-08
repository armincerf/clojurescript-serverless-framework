(ns todo-mvc.core
  (:require
   [helix.core :as hx :refer [$ <>]]
   [helix.dom :as d]
   ["../gen/Title.js" :refer (Title)]
   [todo-mvc.components :as c]
   [todo-mvc.lib :refer [defnc]]
   ["react-dom" :as rdom]
   ["react-router-dom" :as rr]))

(defnc App
  []
  ($ rr/BrowserRouter
     (d/main
      {:class "py-16 mx-auto max-w-3xl"}

      (d/section
       {:class "todoapp"}
       (d/header
        {:class "header"}
        ($ Title {:label "Tasks"
                  :size "medium"
                  :primary true}))
       (c/todo-list))
      (c/app-footer))))

(defn ^:export start
  []
  (rdom/render ($ App) (js/document.getElementById "app")))
