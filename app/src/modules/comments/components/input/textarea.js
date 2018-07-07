import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Textarea from 'components/textarea';

class CommentTextarea extends PureComponent {
  onKeyDown = evt => {
    const { onSave, onCancel } = this.props;

    if (evt.keyCode === 27) {
      // esc
      evt.preventDefault();
      onCancel();
    } else if (evt.keyCode === 13 && (evt.metaKey || evt.ctrlKey)) {
      // (cmd or ctrl) + enter
      evt.preventDefault();
      onSave();
    }
  };

  render() {
    const { value, placeholder, onChange, saving } = this.props;
    return (
      <Textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={this.onKeyDown}
        disabled={saving}
      />
    );
  }
}

CommentTextarea.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
};

CommentTextarea.defaultProps = {
  placeholder: '',
};

export default CommentTextarea;
