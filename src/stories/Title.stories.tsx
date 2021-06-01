import React from 'react';

import { Title } from './Title';

export default {
  title: 'Example/Title',
  component: Title,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Title {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Title',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Title',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Title',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Title',
};
