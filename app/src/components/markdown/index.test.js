import React from 'react';
import { shallow } from 'enzyme';

import { Markdown } from '.';

test('render markdown', () => {
  const props = {
    text: `# Title

    A little bit of text
    `,
  };

  const tree = shallow(<Markdown {...props} />);
  expect(tree).toMatchSnapshot();
});
