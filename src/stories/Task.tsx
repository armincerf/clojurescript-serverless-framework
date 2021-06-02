import React, { HTMLAttributes } from "react";

export interface TaskProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * An object containing required strings id, title and state.
   * State must be one of 'TASK_ARCHIVED',
   */
  task: {
    id: string;
    title: string;
    state: "TASK_ARCHIVED" | "TASK_INBOX" | "TASK_PINNED";
  };
  /**
   * Function called when archive button is clicked
   */
  onArchiveTask: (id: TaskProps["task"]["id"]) => void;
  /**
   * Function called when task pinned
   */
  onPinTask: (id: TaskProps["task"]["id"]) => void;
}

/**
 * Primary UI component for user interaction
 */
export const Task: React.FC<TaskProps> = ({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
  ...props
}) => {
  return (
    <div className={"flex items-center border-b border-solid border-gray-100 text-2xl"}>
      <label className="p-4">
        <input
        className="h-10 w-10"
          type="checkbox"
          defaultChecked={state === "TASK_ARCHIVED"}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="h-10">
        <input
        className={"overflow-ellipsis " + state}
          type="text"
          value={title}
          readOnly={true}
          placeholder="Input title"
        />
      </div>

      <div className="actions" onClick={(event) => event.stopPropagation()}>
        {state !== "TASK_ARCHIVED" && (
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
};
