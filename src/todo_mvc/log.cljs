(ns todo-mvc.log)

;;todo - add some proper logging setup
(defn error
  [message opts]
  (prn (str "Error: " message ". More details: " opts)))
