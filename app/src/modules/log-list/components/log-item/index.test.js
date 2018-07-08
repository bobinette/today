import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import LogItem from '.';

jest.mock('modules/comments', () => 'Comments');

test('render a log item', () => {
  const props = {
    log: fromJS({
      uuid: '1',
      content: 'content 1',
      createdAt: '2018-04-03T17:55:03',
    }),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  const tree = shallow(<LogItem {...props} />);
  expect(tree).toMatchSnapshot();
});

test('call actions', () => {
  const props = {
    log: fromJS({ uuid: '1', content: 'content 1' }),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  const wrapper = shallow(<LogItem {...props} />);

  wrapper.find('.LogItem__ActionEdit').simulate('click');
  expect(props.onEdit).toHaveBeenCalledWith('1');

  wrapper.find('.LogItem__ActionDelete').simulate('click');
  expect(props.onDelete).toHaveBeenCalledWith('1');
});
