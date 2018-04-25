function locator(value, fromIndex) {
  return value.indexOf('#', fromIndex);
}

const TAG_REGEX = /^(?:\B)(#(?:\w|-|:)+)\b/;

function plugin() {
  function tokenizer(eat, value, silent) {
    const opening = value.slice(0, 2);

    if (opening === '\\#') {
      if (silent) {
        return true;
      }

      return eat(opening)({
        type: 'text',
        value: '#',
      });
    }

    const match = TAG_REGEX.exec(value);
    if (match === null) {
      return undefined;
    }

    if (silent) {
      return true;
    }

    const substring = match[0];
    const tag = match[1].trim();

    const node = {
      type: 'emphasis',
      data: {
        hName: 'span',
        hProperties: {
          className: 'TodayTag',
        },
      },
      children: [
        {
          type: 'text',
          value: tag,
        },
      ],
    };

    return eat(substring)(node);
  }
  tokenizer.locator = locator;

  const { Parser } = this;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  tokenizers.tag = tokenizer;
  methods.splice(methods.indexOf('paragraph'), 0, 'tag');

  // return tree => {
  //   debugger;
  // };
}

export default plugin;
