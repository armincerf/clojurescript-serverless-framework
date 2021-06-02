import React from "react";

import { TaskList, TaskListProps } from "./TaskList";
import * as TaskStories from "./Task.stories";
import * as TaskHeaderStories from "./TaskHeader.stories";

export default {
  component: TaskList,
  title: "TODO/TaskList",
};
const Template = (args: TaskListProps) => <TaskList {...args} />;
const defaultTask = {
  task: { ...TaskStories.Default.args.task },
  onArchiveTask: () => null,
  onPinTask: () => null,
};

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited the Default story in task.stories.js.
  tasks: Array(6)
    .fill(defaultTask)
    .map((taskProps, i) => ({
      ...taskProps,
      task: { ...taskProps.task, id: i, title: `Task ${i}` },
    })),
  taskHeaderProps: TaskHeaderStories.Default.args,
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
