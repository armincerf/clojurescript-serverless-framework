(ns todo-mvc.core
  (:require [helix.core :refer [$]]
            [todo-mvc.lib :refer [defnc]]
            [helix.hooks :as hooks]
            [helix.dom :as d]
            [cljs-bean.core :refer [->clj]]
            [react-query :refer [QueryClient QueryClientProvider]]
            ["react-query/devtools" :refer [ReactQueryDevtools]]
            ["/jsviews/test" :refer [Test useTodos]]
            ["react-dom" :as rdom]))

(def foo 2)

(def query-client (new QueryClient))

(defnc todo-counter
  []
  (let [{:keys [data]}
        (->clj (useTodos #js {:select #(.-length %)
                              :notifyOnChangeProps #js ["data"]}))]
    (d/div "Todo Counter: " (or data 0))))

(defnc app []
  ($ QueryClientProvider {:client query-client}
     (d/main
      {:class "flex-grow block overflow-x-hidden bg-base-100 text-base-content drawer-content"}
      (d/div
       {:class "p-4 lg:p-10"}
       ($ Test)
       ($ todo-counter)
       ($ ReactQueryDevtools {:initialIsOpen true})))))

(rdom/render ($ app) (js/document.getElementById "app"))
