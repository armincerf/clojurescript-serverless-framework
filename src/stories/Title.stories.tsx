import { Story, Meta } from '@storybook/react';

import { Title, TitleProps } from './Title';

export default {
  title: 'Todo/Title',
  component: Title,
} as Meta;

const Template: Story<TitleProps> = (args) => <Title {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Title',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Title',
};