import React from 'react';
import { mount, shallow } from 'enzyme';

import LogItemEditing from '.';

test('render a log item in edit mode', () => {
  const props = {
    uuid: '1',
    content: 'content',
    updating: false,
    onEditContent: jest.fn(),
    onCancel: jest.fn(),
    onUpdate: jest.fn(),
  };

  const tree = shallow(<LogItemEditing {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render a log item in edit mode updating', () => {
  const props = {
    uuid: '1',
    content: 'content',
    updating: true,
    onEditContent: jest.fn(),
    onCancel: jest.fn(),
    onUpdate: jest.fn(),
  };

  const tree = shallow(<LogItemEditing {...props} />);
  expect(tree).toMatchSnapshot();
});

test('actions', () => {
  const props = {
    uuid: '1',
    content: 'content',
    updating: false,
    onEditContent: jest.fn(),
    onCancel: jest.fn(),
    onUpdate: jest.fn(),
  };

  const wrapper = mount(<LogItemEditing {...props} />);
  wrapper
    .find('textarea.LogItemEditing__Content') // Use the tag otherwise 2 elements are found
    .simulate('change', { target: { value: 'value' } });
  expect(props.onEditContent).toHaveBeenCalledWith('1', 'value');

  wrapper.find('.LogItemEditing__Update').simulate('click');
  expect(props.onUpdate).toHaveBeenCalledWith('1');

  wrapper.find('.LogItemEditing__Cancel').simulate('click');
  expect(props.onCancel).toHaveBeenCalledWith('1');
});
