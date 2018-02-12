import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import { NavBar } from '.';

test('render the log list', () => {
  const fetchLogs = jest.fn();
  const props = {};

  const tree = shallow(<NavBar {...props} />);
  expect(tree).toMatchSnapshot();
});
