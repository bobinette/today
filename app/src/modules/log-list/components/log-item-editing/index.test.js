import React from 'react';
import { shallow } from 'enzyme';

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
