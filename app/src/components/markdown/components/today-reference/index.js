import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

import axios from 'axios';

import apiUrl from 'utils/apiUrl';
import { formatError } from 'utils/axios';

// Circular deps...
import Markdown from 'components/markdown';

import './today-reference.scss';

export async function fetchLog(uuid) {
  try {
    const response = await axios.get(`${apiUrl}/api/logs/${uuid}`);
    return { log: response.data };
  } catch (error) {
    return { error: formatError(error) };
  }
}

class TodayReference extends PureComponent {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      log: null,
      loading: true,
      errored: false,
    };
  }

  async componentDidMount() {
    if (this.props.autoLoad) {
      this.setState({ loading: true });
      const { log, error } = await fetchLog(this.props.uuid);
      this.setState({ log: fromJS(log), errored: !!error, loading: false });
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.uuid !== this.props.uuid) {
      this.setState({ log: null });
      if (nextProps.autoLoad) {
        this.setState({ loading: true });
        const { log, error } = await fetchLog(nextProps.uuid);
        this.setState({ log, errored: !!error, loading: false });
      }
    }
  }

  render() {
    const { autoLoad, uuid } = this.props;
    const { log } = this.state;

    return (
      <span className="TodayReference">
        {!autoLoad &&
        !log && (
          <span>
            Unloaded reference to <code>{uuid}</code>
          </span>
        )}
        {log &&
        log.get('content') && (
          <Markdown text={log.get('content')} autoLoadReferences={false} />
        )}
      </span>
    );
  }
}

TodayReference.propTypes = {
  autoLoad: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
};

TodayReference.defaultProps = {
  autoLoad: false,
};

export default TodayReference;
