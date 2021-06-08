(ns todo-mvc.components
  (:require [helix.core :as helix]))

(defmacro title [& args]
  `(helix/$ Title ~@args))

(defmacro app-footer [& args]
  `(helix/$ AppFooter ~@args))

(defmacro todo-list [& args]
  `(helix/$ TodoList ~@args))
