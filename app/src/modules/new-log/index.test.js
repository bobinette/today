import React from 'react';
import { shallow } from 'enzyme';

import { NewLogInput } from '.';

test('render the input with no title', () => {
  const props = {
    content: 'Test',
    titleDetected: false,
    actions: {
      createLog: jest.fn(),
      updateContent: jest.fn(),
    },
  };

  const tree = shallow(<NewLogInput {...props} />);
  expect(tree).toMatchSnapshot();
});

test('render the input with a title detected', () => {
  const props = {
    content: 'Test',
    titleDetected: false,
    actions: {
      createLog: jest.fn(),
      updateContent: jest.fn(),
    },
  };

  const tree = shallow(<NewLogInput {...props} />);
  expect(tree).toMatchSnapshot();
});
