import React from 'react';
import { fromJS } from 'immutable';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Markdown } from '.';

configure({ adapter: new Adapter() });

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
