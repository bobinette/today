import { hasTitle } from './utils';

test('hasTitle', () => {
  let has = hasTitle(`
# Title here
The title should be detected
  `);
  expect(has).toBe(true);

  has = hasTitle(`
#noTitle
No title should be detected: space missing
  `);
  expect(has).toBe(false);
});
