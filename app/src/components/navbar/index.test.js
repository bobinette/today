import React from 'react';
import { fromJS } from 'immutable';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NavBar } from '.';

configure({ adapter: new Adapter() });

test('render the log list', () => {
  const fetchLogs = jest.fn();
  const props = {};

  const tree = shallow(<NavBar {...props} />);
  expect(tree).toMatchSnapshot();
});
