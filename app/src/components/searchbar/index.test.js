import React from 'react';
import { shallow } from 'enzyme';

import SearchBar from '.';

test('render SearchBar', () => {
  const props = { q: '', onChange: jest.fn() };

  const tree = shallow(<SearchBar {...props} />);
  expect(tree).toMatchSnapshot();
});
