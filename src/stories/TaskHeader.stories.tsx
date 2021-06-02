import { Story, Meta } from "@storybook/react";
import { NewLineKind } from "typescript";

import { TaskHeader, TaskHeaderProps } from "./TaskHeader";

export default {
  title: "Todo/TaskHeader",
  component: TaskHeader,
  parameters: { assets: ["designs/items.png"] },
} as Meta;

const Template: Story<TaskHeaderProps> = (args) => <TaskHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
 label: "What needs to be done?",
 onSelectAll: () => null,
};

export const WithText = Template.bind({});
WithText.args = {
  ...Default.args,
  value: "A new task"
};