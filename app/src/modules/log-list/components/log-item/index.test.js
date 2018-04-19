import React from 'react';
import { fromJS } from 'immutable';
import { mount, shallow } from 'enzyme';

import LogItem from '.';

test('render a log item', () => {
  const props = {
    log: fromJS({
      uuid: '1',
      content: 'content 1',
      createdAt: '2018-04-03T17:55:03',
    }),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  const tree = shallow(<LogItem {...props} />);
  expect(tree).toMatchSnapshot();
});

test('call onDelete', () => {
  const props = {
    log: fromJS({ uuid: '1', content: 'content 1' }),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  const wrapper = mount(<LogItem {...props} />);
  wrapper.find('.LogItem__ActionDelete').simulate('click');
  expect(props.onDelete).toHaveBeenCalledWith('1');
});
