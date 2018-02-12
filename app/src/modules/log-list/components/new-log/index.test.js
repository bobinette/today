import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import { NewLogInput } from '.';

test('render the log list', () => {
  const props = {
    actions: {
      createLog: jest.fn(),
    },
  };

  const tree = shallow(<NewLogInput {...props} />);
  expect(tree).toMatchSnapshot();
});

test('the textarea should appear when focused', () => {
  const props = {
    actions: { createLog: jest.fn() },
  };

  const tree = shallow(<NewLogInput {...props} />);
  tree.setState({ hasFocus: true });
  expect(tree.find('.NewLogInput__Content')).toMatchSnapshot();
});
