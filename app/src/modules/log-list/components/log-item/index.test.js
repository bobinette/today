import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';

import LogItem from '.';

test('render the log list', () => {
  const props = {
    log: fromJS({ uuid: '1', content: 'content 1' }),
  };

  const tree = shallow(<LogItem {...props} />);
  expect(tree).toMatchSnapshot();
});
