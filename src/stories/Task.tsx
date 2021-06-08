import React, { HTMLAttributes } from "react";

export interface TaskProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * An object containing required strings id, title and completed bool.
   */
  task: {
    id: string;
    title: string;
    completed: boolean;
  };
  /**
   * Function called when checkbox button is clicked
   */
  onComplete: (id: TaskProps["task"]["id"]) => void;
}

/**
 * Primary UI component for user interaction
 */
export const Task: React.FC<TaskProps> = ({
  task: { id, title, completed },
  onComplete,
  ...props
}) => {
  console.log(props);

  return (
    <div className={"flex items-center border-b border-solid border-gray-100 text-2xl"}>
      <label className="p-4">
        <input
        className="h-10 w-10"
          type="checkbox"
          defaultChecked={completed}
          onClick={() => onComplete(id)}
          name="checked"
        />
      </label>
      <div className="h-10">
        <input
        className={"overflow-ellipsis " + completed}
          type="text"
          value={title}
          readOnly={true}
          placeholder="Input title"
        />
      </div>
    </div>
  );
};
