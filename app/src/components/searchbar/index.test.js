import React from 'react';
import { shallow, mount } from 'enzyme';

import SearchBar from '.';

test('render SearchBar', () => {
  const props = { q: '', onChange: jest.fn() };

  const tree = shallow(<SearchBar {...props} />);
  expect(tree).toMatchSnapshot();
});

test('test the onChange is called', () => {
  const props = { q: '', onChange: jest.fn() };

  const wrapper = mount(<SearchBar {...props} />);
  wrapper
    .find('.SearchBar__input')
    .simulate('change', { target: { value: 'value' } });
  expect(props.onChange).toHaveBeenCalledWith('value');
});
