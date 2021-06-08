import { Story, Meta } from "@storybook/react";

import { Task, TaskProps } from "./Task";

export default {
  title: "Todo/Task",
  component: Task,
  parameters: { assets: ["designs/items.png"] },
} as Meta;

const Template: Story<TaskProps> = (args) => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: "1",
    title: 'Test Task',
    completed: false
    },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    completed: true,
  },
};

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  }
};