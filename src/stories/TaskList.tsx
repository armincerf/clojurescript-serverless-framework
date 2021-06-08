import React, { HTMLAttributes } from "react";
import { TaskProps, Task } from "./Task";
import { TaskHeader, TaskHeaderProps } from "./TaskHeader";

export interface TaskListProps extends HTMLAttributes<HTMLHeadingElement> {
  loading: boolean;
  tasks: TaskProps[];
  taskHeaderProps: TaskHeaderProps;
}

/**
 * TODO list header used to enter new tasks
 */
export const TaskList: React.FC<TaskListProps> = ({
  loading,
  tasks,
  taskHeaderProps,
}) => {
  const LoadingRow = (
    <li className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </li>
  );

  if (loading) {
    return (
      <ul className="list-items">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </ul>
    );
  }
  if (tasks.length === 0) {
    return (
        <section>
            <TaskHeader {...taskHeaderProps} />
            <ul className="list-items">
                <div className="wrapper-message">
                    <span className="icon-check" />
                    <div className="title-message">You have no tasks</div>
                    <div className="subtitle-message">Sit back and relax</div>
                </div>
            </ul>
        </section>
    );
  }

  return (
    <section>
      <TaskHeader {...taskHeaderProps} />
      <ul className="list-items">
          {tasks.map((taskProps, index) =>
           <Task key={taskProps.task.id} {...taskProps}></Task>
          )}
      </ul>
    </section>
  );
};
