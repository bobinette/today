import React from 'react';
import { fromJS } from 'immutable';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { LogList } from '.';

configure({ adapter: new Adapter() });

test('render the log list', () => {
  const fetchLogs = jest.fn();
  const props = {
    logs: fromJS([
      { uuid: '1', title: 'title 1', content: 'content 1' },
      { uuid: '2', title: 'title 2', content: 'content 2' },
      { uuid: '3', title: 'title 3', content: 'content 3' },
    ]),
    actions: {
      fetchLogs,
    },
  };

  const tree = shallow(<LogList {...props} />);
  expect(tree).toMatchSnapshot();
  expect(fetchLogs).toHaveBeenCalled();
});
