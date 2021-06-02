import React, { HTMLAttributes } from "react";

export interface TaskHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Text to display in the header
   */
  label: string;
  /**
   * Handler which marks all tasks as complete or uncomplete
   */
  onSelectAll: () => void;
  /**
   * Handler called when new task input changed
   */
  onChange: () => void;
  /**
   * Function that listens for return key to add new task
   */
  onKeyDown: () => void;
  /**
   * Current value of new task input
   */
  value?: string;
}

/**
 * TODO list header used to enter new tasks
 */
export const TaskHeader: React.FC<TaskHeaderProps> = ({
  label,
  onSelectAll,
  onChange,
  onKeyDown,
  value,
  ...props
}) => {
  return (
    <header className="bg-white b">
      <button
        className="toggle-all absolute z-10 hover:opacity-95"
        aria-label="Toggle Select All"
        onClick={onSelectAll}
      />
      <input
        {...props}
        name="newTask"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        type="text"
        placeholder={label}
        className="p-4 pl-16 h-16 border-none todo-header"
      />
    </header>
  );
};
