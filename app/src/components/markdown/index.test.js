import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import { Markdown } from '.';

test('render the log list', () => {
  const fetchLogs = jest.fn();
  const props = {
    text: `# Title

    A little bit of text
    `,
  };

  const tree = shallow(<Markdown {...props} />);
  expect(tree).toMatchSnapshot();
});
