(ns todo-mvc.core
  (:require
   ["../gen/Header.js" :refer (Header)]
   ["react" :as r]
   ["react-dom" :as rdom]))

(defn ^:export start
  []
  (rdom/render (r/createElement Header) (js/document.getElementById "app")))
