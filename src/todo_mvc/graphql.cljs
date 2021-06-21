(ns todo-mvc.graphql
  (:require [todo-mvc.log :as log]))

(def hasura-name "alx-todos")

(defonce token (atom nil))

(def me-query
  "Me($id: String!) {
  user(where: {id: {_eq: $id}}) {
    id
    email
  }
}
")

(defn query
  [operations-doc operation-name variables]
  (-> (js/fetch
       (str "https://" hasura-name ".hasura.app/v1/graphql")
       #js {:content-type :json
            :method "post"
            :accept :json
            :headers #js {"Authorization" @token}
            :body (js/JSON.stringify (clj->js {:query (str "query " operations-doc)
                                               :variables variables
                                               :operation-name operation-name}))})
      (.then #(.json %))))

(defn get-me
  [id]
  (query me-query "me" {:id id}))

(defn handle-errors?
  "Takes an 'errors' key from a graphql response and returns true and logs the
  errors if they exist. Returns falsey if there are no errors "
  [potential-errors]
  (when-let [errors (or (:errors potential-errors)
                        (seq potential-errors))]
    (doseq [error errors]
      (log/error (:message error) error))))
