import React from 'react';
import { mount, shallow } from 'enzyme';
import { fromJS } from 'immutable';

import * as matchers from 'jest-immutable-matchers';

import { TodayReference } from '.';

beforeEach(() => {
  jest.addMatchers(matchers);
});

test('render reference without auto load', () => {
  const props = {
    autoLoad: false,
    fetchLog: jest.fn(),
    uuid: '1',
  };

  const tree = shallow(<TodayReference {...props} />);
  expect(tree).toMatchSnapshot();
  expect(tree.state().loading).toBe(false);
  expect(props.fetchLog).not.toHaveBeenCalled();
});

test('render reference without auto load - loading', () => {
  const props = {
    autoLoad: false,
    fetchLog: jest.fn(),
    uuid: '1',
  };

  const tree = shallow(<TodayReference {...props} />);
  tree.setState({ loading: true });
  expect(tree).toMatchSnapshot();
  expect(props.fetchLog).not.toHaveBeenCalled();
});

test('render reference with auto load - log exists', async () => {
  const log = { content: 'pizza yolo' };
  const p = Promise.resolve({ log });
  const props = {
    autoLoad: true,
    fetchLog: jest.fn(() => p),
    uuid: '1',
  };

  const tree = shallow(<TodayReference {...props} />);
  await p;
  expect(props.fetchLog).toHaveBeenCalledWith('1');
  expect(tree.state().loading).toBe(false);
  expect(tree.state().log).toEqualImmutable(fromJS(log));
  // This is the secret to rerender the component after the
  // state has been updated
  tree.update();
  expect(tree).toMatchSnapshot();

  expect(tree.find('.TodayReference__Load').length).toBe(0);
  expect(tree.find('.TodayReference__Error').length).toBe(0);
  expect(tree.find('.TodayReference__Loading').length).toBe(0);
  expect(tree.find('Markdown').length).toBe(1);
});

test('render reference with auto load - errored', async () => {
  const error = { message: 'error' };
  const p = Promise.resolve({ error });
  const props = {
    autoLoad: true,
    fetchLog: jest.fn(() => p),
    uuid: '1',
  };

  const tree = shallow(<TodayReference {...props} />);
  await p;
  expect(props.fetchLog).toHaveBeenCalledWith('1');
  expect(tree.state().loading).toBe(false);
  expect(tree.state().error).toEqual(error);

  tree.update();
  expect(tree).toMatchSnapshot();

  expect(tree.find('.TodayReference__Load').length).toBe(0);
  expect(tree.find('.TodayReference__Error').length).toBe(1);
  expect(tree.find('.TodayReference__Loading').length).toBe(0);
  expect(tree.find('Markdown').length).toBe(0);
});
