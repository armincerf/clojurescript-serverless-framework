import { Story, Meta } from "@storybook/react";

import { Loader, LoaderProps } from "./Loader";

export default {
  title: "Todo/Loader",
  component: Loader,
} as Meta;

const Template: Story<LoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {
title: "Authenticating..."
};

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
    title: longTitleString,
};