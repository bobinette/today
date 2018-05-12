import React from 'react';
import { shallow } from 'enzyme';

import TextArea from '.';

test('render textarea', () => {
  const props = {
    value: 'value',
    onChange: () => {},
  };

  const tree = shallow(<TextArea {...props} />);
  expect(tree).toMatchSnapshot();
});
