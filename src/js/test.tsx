import * as React from "react";
import axios, { AxiosError } from "axios";

import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  UseQueryOptions,
} from "react-query";

type NewTodo = {
  title: string;
  completed: boolean;
  order: number;
  id?: string;
};

type Todo = NewTodo & {
  url?: string;
};

type Todos = Todo[];

async function fetchTodos(): Promise<Todos> {
  const controller = new AbortController();
  const signal = controller.signal;
  const promise: any = fetch(
    "https://todo-backend-clojure-luminus.herokuapp.com/todos",
    {
      method: "GET",
      signal,
    }
  );
  promise.cancel = () => controller.abort();
  const response = (await promise).json();
  return response;
}

export function useTodos<TData = Todos>(
  options?: UseQueryOptions<Todos, AxiosError, TData>
) {
  return useQuery("todos", fetchTodos, options);
}

function TodoTable({
  data,
  handleComplete,
}: {
  data: Todos;
  handleComplete: (todo: Todo) => void;
}) {
  const [rowsSelected, setRowsSelected] = React.useState<Todo["id"][]>([]);

  const handleRowSelect = (checked: boolean, id: Todo["id"]) => {
    if (checked) {
      setRowsSelected(rowsSelected.concat([id]));
    } else {
      setRowsSelected(rowsSelected.filter((i) => i !== id));
    }
  };
  const handleSelectAll = (checked: boolean) => {
    setRowsSelected(checked ? data.filter((t) => !!t.id).map((t) => t.id) : []);
  };

  const queryClient = useQueryClient();
  const deleteTodoMutation = useMutation(
    (todo) =>
      axios.delete(
        `https://todo-backend-clojure-luminus.herokuapp.com/todos/${todo.id}`
      ),
    mutateTodo({
      queryClient,
      newData: (todo, previousTodos) => [
        ...previousTodos.filter((t) => t.id !== todo.id),
      ],
    })
  );
  const handleDeleteSelected = () => {
    const ids = rowsSelected.map((id) => id);
    setRowsSelected([]);
    ids.forEach((id) => {
      const todo = data.find((t) => t.id === id);
      if (todo) {
        deleteTodoMutation.mutate(todo);
      }
    });
  };

  const handleCompleteSelected = (complete: boolean) => {
    const ids = rowsSelected.map((id) => id);
    const todos = data.filter((t) => ids.indexOf(t.id) !== -1);
    setRowsSelected([]);
    todos.forEach((todo) =>
      handleComplete({ ...todo, completed: !complete } as Todo)
    );
  };

  return (
    <div className="overflow-x-auto rounded-none">
      {rowsSelected.length > 0 && (
        <div className="p-3">
          <button
            className="btn btn-outline-secondary"
            onClick={handleDeleteSelected}
          >
            Delete Todos
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleCompleteSelected(true)}
          >
            Mark All Complete
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleCompleteSelected(false)}
          >
            Mark All Uncomplete
          </button>
        </div>
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={rowsSelected.length >= 1}
                  type="checkbox"
                  className="checkbox"
                />
              </label>
            </th>
            <th>Title</th>
            <th>Completed?</th>
            <th>Toggle Completed</th>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => a?.title?.localeCompare(b.title))
            .map((todo) => (
              <tr key={todo.id}>
                <td>
                  <label
                    className="tooltip tooltip-right"
                    data-tip={`ID = ${todo.id}`}
                  >
                    <input
                      onChange={(e) =>
                        handleRowSelect(e.target.checked, todo.id)
                      }
                      disabled={!todo.id}
                      checked={rowsSelected.indexOf(todo.id) !== -1}
                      type="checkbox"
                      className="checkbox"
                    />
                  </label>
                </td>
                <td>{todo.title}</td>
                <td>{todo.completed ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="btn btn-ghost btn-xs mr-2"
                    onClick={() => handleComplete(todo)}
                  >
                    {todo.completed ? "Uncomplete" : "Completed!!"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const mutateTodo = ({
  onMutate,
  queryClient,
  newData,
}: {
  onMutate?: VoidFunction;
  queryClient: QueryClient;
  newData: (todo: NewTodo, prev: Todos) => Todos;
}) => {
  return {
    // When mutate is called:
    onMutate: async (todo: NewTodo) => {
      onMutate && onMutate();
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("todos");

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todos>("todos");

      // Optimistically update to the new value
      if (previousTodos) {
        queryClient.setQueryData<Todos>("todos", newData(todo, previousTodos));
      }

      return { previousTodos };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err: any, _variables: any, context: any) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todos>("todos", context.previousTodos);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  };
};

function genTodo(title: string) {
  return {
    title,
    completed: false,
    order: 0,
  };
}

function Example() {
  const queryClient = useQueryClient();
  const [text, setText] = React.useState("");
  const { isFetching, ...queryInfo } = useTodos();

  const addTodoMutation = useMutation(
    (todo) =>
      axios.post(
        "https://todo-backend-clojure-luminus.herokuapp.com/todos",
        todo
      ),
    mutateTodo({
      onMutate: () => setText(""),
      queryClient,
      newData: (todo, previousTodos) => [{ ...todo }, ...previousTodos],
    })
  );

  const completeTodoMutation = useMutation(
    (todo) =>
      axios.patch(
        `https://todo-backend-clojure-luminus.herokuapp.com/todos/${todo.id}`,
        { completed: !todo.completed }
      ),
    mutateTodo({
      queryClient,
      newData: (todo, previousTodos) => {
        const idx = previousTodos.findIndex((t) => t.id === todo.id);
        return [
          ...previousTodos.slice(0, idx),
          {
            ...todo,
            completed: !todo.completed,
          },
          ...previousTodos.slice(idx + 1),
        ];
      },
    })
  );

  return (
    <div>
      <p>
        In this example, new items can be created using a mutation. The new item
        will be optimistically added to the list in hopes that the server
        accepts the item. If it does, the list is refetched with the true
        items from the list. Every now and then, the mutation may fail though.
        When that happens, the previous list of items is restored and the list
        is again refetched from the server.
      </p>
      <form
        className="form-control pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.length > 0) {
            addTodoMutation.mutate(genTodo(text));
          }
        }}
      >
        <div className="relative sm:w-1/2">
          <input
            type="text"
            placeholder="Eat dinner"
            className="w-full pr-16 input input-primary input-bordered"
            onChange={(event) => setText(event.target.value)}
            value={text}
          />
          <button className="absolute top-0 right-0 rounded-l-none btn btn-primary">
            Add Todo
          </button>
        </div>
      </form>
      <br />
      {console.dir(queryInfo)}
      {queryInfo.isSuccess && (
        <TodoTable
          {...queryInfo}
          handleComplete={(todo: Todo) => completeTodoMutation.mutate(todo)}
        />
      )}
      {queryInfo.isLoading && "Loading"}
      {queryInfo.error?.message}
    </div>
  );
}

export function Test() {
  return <Example />;
}
