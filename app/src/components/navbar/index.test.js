import React from 'react';
import { shallow } from 'enzyme';

import { NavBar } from '.';

test('render navbar', () => {
  const props = {};

  const tree = shallow(<NavBar {...props} />);
  expect(tree).toMatchSnapshot();
});
