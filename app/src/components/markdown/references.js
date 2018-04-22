function locator(value, fromIndex) {
  return value.indexOf('{', fromIndex);
}

const TODAY_REF = /^{today:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})}/i;

function plugin(opts) {
  const options = opts || {};

  const { builder } = options;

  function tokenizer(eat, value, silent) {
    const opening = value.slice(0, 2);

    if (opening === '\\{') {
      if (silent) {
        return true;
      }

      return eat(opening)({
        type: 'text',
        value: '{',
      });
    }

    const match = TODAY_REF.exec(value);
    if (match === null) {
      return undefined;
    }

    if (silent) {
      return true;
    }

    const substring = match[0];
    const uuid = match[1].trim();

    const custom = builder !== undefined ? builder(uuid) : undefined;

    const node = custom || {
      type: 'todayReference',
      data: {
        hProperties: {
          uuid,
          autoLoad: options.autoLoad || false,
        },
      },
    };

    return eat(substring)(node);
  }
  tokenizer.locator = locator;

  const { Parser } = this;
  const tokenizers = Parser.prototype.blockTokenizers;
  const methods = Parser.prototype.blockMethods;

  tokenizers.todayReference = tokenizer;
  methods.splice(methods.indexOf('paragraph'), 0, 'todayReference');
}

export const handler = {
  todayReference: (h, node) => h(node, 'TodayReference'),
};

export default plugin;
