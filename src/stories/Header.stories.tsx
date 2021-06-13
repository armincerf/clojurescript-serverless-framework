import React from "react";
import { Story, Meta } from "@storybook/react";

import { Header, HeaderProps } from "./Header";

export default {
  title: "Todo/Header",
  component: Header,
} as Meta;

const Template: Story<HeaderProps> = (args) => <Header {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: { email: "bob@bob.com" },
  pages: [{ name: "Home", href: "#" }],
};

export const LoggedOut = Template.bind({});
LoggedOut.args = { ...LoggedIn.args, user: undefined };
