import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './actions.scss';

class CommentActions extends PureComponent {
  render() {
    const { canSave, saving, onSave, onCancel } = this.props;

    return (
      <div className="float-right">
        <button
          className="btn btn-outline-secondary btn-sm CommentActions__button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary btn-sm CommentActions__button"
          onClick={onSave}
          disabled={saving || !canSave}
        >
          {saving ? (
            <span>
              Commenting...<i className="fas fa-circle-notch fa-spin btn-spinner" />
            </span>
          ) : (
            'Comment'
          )}
        </button>
      </div>
    );
  }
}

CommentActions.propTypes = {
  canSave: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CommentActions;
