"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTodos = useTodos;
exports.Test = Test;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var React = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _reactQuery = require("react-query");

var _jsxRuntime = require("react/jsx-runtime");

var _excluded = ["isFetching"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function fetchTodos() {
  return _fetchTodos.apply(this, arguments);
}

function _fetchTodos() {
  _fetchTodos = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var controller, signal, promise, response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            controller = new AbortController();
            signal = controller.signal;
            promise = fetch("https://todo-backend-clojure-luminus.herokuapp.com/todos", {
              method: "GET",
              signal: signal
            });

            promise.cancel = function () {
              return controller.abort();
            };

            _context2.next = 6;
            return promise;

          case 6:
            response = _context2.sent.json();
            return _context2.abrupt("return", response);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchTodos.apply(this, arguments);
}

function useTodos(options) {
  return (0, _reactQuery.useQuery)("todos", fetchTodos, options);
}

function TodoTable(_ref) {
  var data = _ref.data,
      handleComplete = _ref.handleComplete;

  var _React$useState = React.useState([]),
      _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
      rowsSelected = _React$useState2[0],
      setRowsSelected = _React$useState2[1];

  var handleRowSelect = function handleRowSelect(checked, id) {
    if (checked) {
      setRowsSelected(rowsSelected.concat([id]));
    } else {
      setRowsSelected(rowsSelected.filter(function (i) {
        return i !== id;
      }));
    }
  };

  var handleSelectAll = function handleSelectAll(checked) {
    setRowsSelected(checked ? data.filter(function (t) {
      return !!t.id;
    }).map(function (t) {
      return t.id;
    }) : []);
  };

  var queryClient = (0, _reactQuery.useQueryClient)();
  var deleteTodoMutation = (0, _reactQuery.useMutation)(function (todo) {
    return _axios["default"]["delete"]("https://todo-backend-clojure-luminus.herokuapp.com/todos/".concat(todo.id));
  }, mutateTodo({
    queryClient: queryClient,
    newData: function newData(todo, previousTodos) {
      return (0, _toConsumableArray2["default"])(previousTodos.filter(function (t) {
        return t.id !== todo.id;
      }));
    }
  }));

  var handleDeleteSelected = function handleDeleteSelected() {
    var ids = rowsSelected.map(function (id) {
      return id;
    });
    setRowsSelected([]);
    ids.forEach(function (id) {
      var todo = data.find(function (t) {
        return t.id === id;
      });

      if (todo) {
        deleteTodoMutation.mutate(todo);
      }
    });
  };

  var handleCompleteSelected = function handleCompleteSelected(complete) {
    var ids = rowsSelected.map(function (id) {
      return id;
    });
    var todos = data.filter(function (t) {
      return ids.indexOf(t.id) !== -1;
    });
    setRowsSelected([]);
    todos.forEach(function (todo) {
      return handleComplete(_objectSpread(_objectSpread({}, todo), {}, {
        completed: !complete
      }));
    });
  };

  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "overflow-x-auto rounded-none",
    children: [rowsSelected.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "p-3",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        className: "btn btn-outline-secondary",
        onClick: handleDeleteSelected,
        children: "Delete Todos"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        className: "btn btn-outline-secondary",
        onClick: function onClick() {
          return handleCompleteSelected(true);
        },
        children: "Mark All Complete"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        className: "btn btn-outline-secondary",
        onClick: function onClick() {
          return handleCompleteSelected(false);
        },
        children: "Mark All Uncomplete"
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("table", {
      className: "table w-full",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("thead", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("tr", {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("th", {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                onChange: function onChange(e) {
                  return handleSelectAll(e.target.checked);
                },
                checked: rowsSelected.length >= 1,
                type: "checkbox",
                className: "checkbox"
              })
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("th", {
            children: "Title"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("th", {
            children: "Completed?"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("th", {
            children: "Toggle Completed"
          })]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("tbody", {
        children: data.sort(function (a, b) {
          var _a$title;

          return a === null || a === void 0 ? void 0 : (_a$title = a.title) === null || _a$title === void 0 ? void 0 : _a$title.localeCompare(b.title);
        }).map(function (todo) {
          return /*#__PURE__*/(0, _jsxRuntime.jsxs)("tr", {
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("td", {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                className: "tooltip tooltip-right",
                "data-tip": "ID = ".concat(todo.id),
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  onChange: function onChange(e) {
                    return handleRowSelect(e.target.checked, todo.id);
                  },
                  disabled: !todo.id,
                  checked: rowsSelected.indexOf(todo.id) !== -1,
                  type: "checkbox",
                  className: "checkbox"
                })
              })
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("td", {
              children: todo.title
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("td", {
              children: todo.completed ? "Yes" : "No"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("td", {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                className: "btn btn-ghost btn-xs mr-2",
                onClick: function onClick() {
                  return handleComplete(todo);
                },
                children: todo.completed ? "Uncomplete" : "Completed!!"
              })
            })]
          }, todo.id);
        })
      })]
    })]
  });
}

var mutateTodo = function mutateTodo(_ref2) {
  var _onMutate = _ref2.onMutate,
      queryClient = _ref2.queryClient,
      newData = _ref2.newData;
  return {
    // When mutate is called:
    onMutate: function () {
      var _onMutate2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(todo) {
        var previousTodos;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _onMutate && _onMutate(); // Cancel any outgoing refetches (so they don't overwrite our optimistic update)

                _context.next = 3;
                return queryClient.cancelQueries("todos");

              case 3:
                // Snapshot the previous value
                previousTodos = queryClient.getQueryData("todos"); // Optimistically update to the new value

                if (previousTodos) {
                  queryClient.setQueryData("todos", newData(todo, previousTodos));
                }

                return _context.abrupt("return", {
                  previousTodos: previousTodos
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function onMutate(_x) {
        return _onMutate2.apply(this, arguments);
      }

      return onMutate;
    }(),
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: function onError(err, _variables, context) {
      if (context !== null && context !== void 0 && context.previousTodos) {
        queryClient.setQueryData("todos", context.previousTodos);
      }
    },
    // Always refetch after error or success:
    onSettled: function onSettled() {
      queryClient.invalidateQueries("todos");
    }
  };
};

function genTodo(title) {
  return {
    title: title,
    completed: false,
    order: 0
  };
}

function Example() {
  var _queryInfo$error;

  var queryClient = (0, _reactQuery.useQueryClient)();

  var _React$useState3 = React.useState(""),
      _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
      text = _React$useState4[0],
      setText = _React$useState4[1];

  var _useTodos = useTodos(),
      isFetching = _useTodos.isFetching,
      queryInfo = (0, _objectWithoutProperties2["default"])(_useTodos, _excluded);

  var addTodoMutation = (0, _reactQuery.useMutation)(function (todo) {
    return _axios["default"].post("https://todo-backend-clojure-luminus.herokuapp.com/todos", todo);
  }, mutateTodo({
    onMutate: function onMutate() {
      return setText("");
    },
    queryClient: queryClient,
    newData: function newData(todo, previousTodos) {
      return [_objectSpread({}, todo)].concat((0, _toConsumableArray2["default"])(previousTodos));
    }
  }));
  var completeTodoMutation = (0, _reactQuery.useMutation)(function (todo) {
    return _axios["default"].patch("https://todo-backend-clojure-luminus.herokuapp.com/todos/".concat(todo.id), {
      completed: !todo.completed
    });
  }, mutateTodo({
    queryClient: queryClient,
    newData: function newData(todo, previousTodos) {
      var idx = previousTodos.findIndex(function (t) {
        return t.id === todo.id;
      });
      return [].concat((0, _toConsumableArray2["default"])(previousTodos.slice(0, idx)), [_objectSpread(_objectSpread({}, todo), {}, {
        completed: !todo.completed
      })], (0, _toConsumableArray2["default"])(previousTodos.slice(idx + 1)));
    }
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "In this example, new items can be created using a mutation. The new item will be optimistically added to the list in hopes that the server accepts the item. If it does, the list is refetched with the true items from the list. Every now and then, the mutation may fail though. When that happens, the previous list of items is restored and the list is again refetched from the server."
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("form", {
      className: "form-control pt-4",
      onSubmit: function onSubmit(e) {
        e.preventDefault();

        if (text.length > 0) {
          addTodoMutation.mutate(genTodo(text));
        }
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "relative sm:w-1/2",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          type: "text",
          placeholder: "Eat dinner",
          className: "w-full pr-16 input input-primary input-bordered",
          onChange: function onChange(event) {
            return setText(event.target.value);
          },
          value: text
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
          className: "absolute top-0 right-0 rounded-l-none btn btn-primary",
          children: "Add Todo"
        })]
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), console.dir(queryInfo), queryInfo.isSuccess && /*#__PURE__*/(0, _jsxRuntime.jsx)(TodoTable, _objectSpread(_objectSpread({}, queryInfo), {}, {
      handleComplete: function handleComplete(todo) {
        return completeTodoMutation.mutate(todo);
      }
    })), queryInfo.isLoading && "Loading", (_queryInfo$error = queryInfo.error) === null || _queryInfo$error === void 0 ? void 0 : _queryInfo$error.message]
  });
}

function Test() {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Example, {});
}