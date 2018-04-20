import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import { LogList } from '.';

test('render the log list', () => {
  const props = {
    logs: fromJS([
      {
        source: { uuid: '1', content: 'content 1' },
        edited: { editing: false },
      },
      {
        source: { uuid: '2', content: 'content 2' },
        edited: { editing: false },
      },
      {
        source: { uuid: '3', content: 'content 3' },
        edited: { editing: false },
      },
    ]),
    q: 'q',
    actions: {
      deleteLog: jest.fn(),
      fetchLogs: jest.fn(),
      onSearchChange: jest.fn(),
      onUpdate: jest.fn(),
      startEditing: jest.fn(),
      edit: jest.fn(),
      stopEditing: jest.fn(),
    },
  };

  const tree = shallow(<LogList {...props} />);
  expect(tree).toMatchSnapshot();
  expect(props.actions.fetchLogs).toHaveBeenCalled();
});

test('render the log list with one in edit mode', () => {
  const props = {
    logs: fromJS([
      {
        source: { uuid: '1', content: 'content 1' },
        edited: { editing: false },
      },
      {
        source: { uuid: '2', content: 'content 2' },
        edited: { editing: true, content: 'editing', updating: false },
      },
      {
        source: { uuid: '3', content: 'content 3' },
        edited: { editing: false },
      },
    ]),
    q: 'q',
    actions: {
      deleteLog: jest.fn(),
      fetchLogs: jest.fn(),
      onSearchChange: jest.fn(),
      onUpdate: jest.fn(),
      startEditing: jest.fn(),
      edit: jest.fn(),
      stopEditing: jest.fn(),
    },
  };

  const tree = shallow(<LogList {...props} />);
  expect(tree).toMatchSnapshot();
  expect(props.actions.fetchLogs).toHaveBeenCalled();
});
