import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import { LogList } from '.';

test('render the log list', () => {
  const fetchLogs = jest.fn();
  const onSearchChange = jest.fn();
  const props = {
    logs: fromJS([
      { uuid: '1', content: 'content 1' },
      { uuid: '2', content: 'content 2' },
      { uuid: '3', content: 'content 3' },
    ]),
    q: 'q',
    actions: {
      fetchLogs,
      onSearchChange,
    },
  };

  const tree = shallow(<LogList {...props} />);
  expect(tree).toMatchSnapshot();
  expect(fetchLogs).toHaveBeenCalled();
});
