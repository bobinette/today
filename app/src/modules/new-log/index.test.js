import React from 'react';
import { shallow } from 'enzyme';

import { NewLogInput } from '.';

test('render the input', () => {
  const props = {
    content: 'Test',
    actions: {
      createLog: jest.fn(),
      updateContent: jest.fn(),
    },
  };

  const tree = shallow(<NewLogInput {...props} />);
  expect(tree).toMatchSnapshot();
});
