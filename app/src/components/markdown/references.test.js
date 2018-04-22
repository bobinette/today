import remark from 'remark';
import todayReference from './references';

const compile = node => {
  const res = { type: node.type };

  if (node.value) {
    res.value = node.value;
  }
  if (node.data) {
    res.data = node.data;
  }

  if (node.children) {
    res.children = node.children.map(compile);
  }

  return res;
};

test('parses reference', async () => {
  const compiler = remark()
    .use(todayReference)
    .use(function cmp() {
      this.Compiler = compile;
    });

  const res = await compiler.process(
    'Before\n\n{today:00000000-0000-0000-0000-000000000000}\n\nAfter',
  );

  expect(res.contents).toEqual({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Before' }],
      },
      {
        type: 'todayReference',
        data: {
          hProperties: {
            autoLoad: false,
            uuid: '00000000-0000-0000-0000-000000000000',
          },
        },
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'After' }],
      },
    ],
  });
});
