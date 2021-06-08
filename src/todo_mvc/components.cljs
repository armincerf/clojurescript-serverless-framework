(ns todo-mvc.components
  (:require
   [helix.dom :as d]
   [clojure.string :as string]
   [todo-mvc.storage :as storage]
   [cljs.pprint :as pprint]
   [potpuri.core :as p]
   [helix.core :as hx :refer [$ <>]]
   ["../gen/TaskList.js" :refer (TaskList)]
   [helix.hooks :as hooks]
   [todo-mvc.lib :refer [defnc]])
  (:require-macros
   [todo-mvc.components]))

(defn enter-key? [ev]
  (= (.-which ev) 13))

(defn escape-key? [ev]
  (= (.-which ev) 27))

(defnc Title
  []
  (d/h1 "Todos"))

(defnc AppFooter []
  (d/footer
   {:class "info"}
   (d/p "Double click to edit a todo")
   (d/p "Part of " (d/a {:href "http://todomvc.com"} "TodoMVC"))))

(defn init-state [title]
  {:editing? false
   :title title})

(defmulti todo-actions (fn [_state action] (first action)))

(defmethod todo-actions
  ::start-editing [state _]
  (assoc state :editing? true))

(defmethod todo-actions
  ::stop-editing [state _]
  (assoc state :editing? false))

(defmethod todo-actions
  ::update-title [state [_ new-title]]
  (assoc state :title new-title))

(defmethod todo-actions
  ::reset [_state [_ initial-title]]
  (init-state initial-title))


(defn todo [id title]
  {:id id
   :title title
   :completed false})

(defn all-complete? [todos]
  (every? :completed todos))

(defmulti todo-actions (fn [_ action] (first action)))

(defmethod todo-actions
  ::init [state _]
  ;; initialize with empty vector if nothing in local storage
  (or state []))

(defmethod todo-actions
  ::add [todos [_ title]]
  (conj todos (todo (str (random-uuid)) title)))

(defmethod todo-actions
  ::remove [todos [_ id]]
  (into [] (remove #(= (:id %) id)) todos))

(defmethod todo-actions
  ::toggle [todos [_ id]]
  (p/update-first todos {:id id} #(update % :completed not)))

(defmethod todo-actions
  ::update-title [todos [_ id title]]
  (into
   []
   (map
    #(if (= (:id %) id)
       (assoc % :title (string/trim title))
       %))
   todos))

(defmethod todo-actions
  ::toggle-all [todos _]
  (let [all-complete? (all-complete? todos)]
    (into [] (map #(assoc % :completed (not all-complete?))) todos)))

(defmethod todo-actions
  ::clear-completed [todos _]
  (filterv (comp not :completed) todos))



(defnc TodoList
  []
  (let [[todos dispatch] (storage/use-persisted-reducer
                          "todos-helix"
                          todo-actions
                          nil
                          #(todo-actions % [::init]))
        active-todos (filter (comp not :completed) todos)
        completed-todos (filter :completed todos)

        ;; TodoList handlers
        remove-todo #(dispatch [::remove %])
        toggle-todo #(dispatch [::toggle %])
        update-todo-title (fn [id title]
                            (dispatch [::update-title id title]))
        tasks
        (clj->js
         (for [{:keys [id] :as todo} todos
               :let [initial-title (:title todo)]]
           {:task todo
            :onKeyDown #(cond
                          (and (enter-key? %)
                               (= (.. % -target -value) ""))
                          (remove-todo id)
                          (enter-key? %)
                          (prn "enter")
                          (escape-key? %)
                          (dispatch [::reset initial-title]))
            :onComplete #(toggle-todo id)
            :onDestroy #(remove-todo id)
            :onDoubleClick #(dispatch [::start-editing])
            :onChange #(dispatch [::update-title (.. % -target -value)])}))
        [new-todo set-new-todo] (hooks/use-state "")
        on-change #(set-new-todo (.. % -target -value))]
    (<>
     (d/code
      {:style {:text-align "left"}}
      (d/pre (with-out-str (pprint/pprint todos))))
     ($ TaskList
        {:tasks tasks
         :taskHeaderProps #js {:label "What needs to be done?"
                               :className "new-todo"
                               :placeholder "What needs to be done?"
                               :autoFocus true
                               :value new-todo
                               :onKeyDown
                               #(when (enter-key? %)
                                  (dispatch [::add (string/trim new-todo)])
                                  (set-new-todo ""))
                               :onChange on-change
                               :onSelectAll #(prn "select all")}}))))
