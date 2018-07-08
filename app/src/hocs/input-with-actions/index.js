import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function withActions(InputComponent, ActionComponent) {
  class InputWithActions extends PureComponent {
    constructor(props) {
      super(props);

      this.onSave = this.onSave.bind(this);

      this.state = { value: '', saving: false };
    }

    onChange = value => {
      this.setState({ value });
    };

    async onSave() {
      const { onSave } = this.props;
      const { value } = this.state;

      this.setState({ saving: true });
      await sleep(1000);
      try {
        await onSave(value);
      } catch (err) {
        this.setState({ saving: false });
        return;
      }

      this.setState({ value: '', saving: false });
    }

    render() {
      const { onCancel, ...props } = this.props;
      const { value, saving } = this.state;

      return (
        <div>
          <InputComponent
            {...props}
            value={value}
            onChange={this.onChange}
            onSave={this.onSave}
            onCancel={onCancel}
            saving={saving}
          />
          <ActionComponent
            canSave={!!value}
            onSave={this.onSave}
            onCancel={onCancel}
            saving={saving}
          />
        </div>
      );
    }
  }

  InputWithActions.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  InputWithActions.displayName = `InputWithActions(${getDisplayName(
    InputComponent,
  )}, ${getDisplayName(ActionComponent)})`;

  return InputWithActions;
}

export default withActions;
