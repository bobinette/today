import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';

import classNames from 'classnames';
import axios from 'axios';

import Tooltip from 'rc-tooltip';

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

export class TodayReference extends PureComponent {
  constructor(props) {
    super(props);

    this.onMouseOver = this.onMouseEvent.bind(this, true);
    this.onMouseOut = this.onMouseEvent.bind(this, false);
    this.load = this.load.bind(this);

    this.state = {
      log: null,
      loading: false,
      error: null,
      hovered: false,
    };
  }

  async componentDidMount() {
    if (this.props.autoLoad) {
      await this.load(this.props.uuid);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.uuid !== this.props.uuid) {
      this.setState({ log: null });
      if (nextProps.autoLoad) {
        await this.load(nextProps.uuid);
      }
    }
  }

  onMouseEvent(hovered, evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.setState({ hovered });
  }

  async load(uuid) {
    this.setState({ log: null, loading: true });
    const { log, error } = await this.props.fetchLog(uuid);
    this.setState({
      log: fromJS(log),
      error,
      loading: false,
    });
  }

  renderInternal() {
    const { uuid } = this.props;
    const { error, loading, log } = this.state;

    if (loading) {
      return (
        <div className="TodayReference__Loading text-muted">
          <em>
            <i className="fas fa-circle-notch fa-spin TodayReference__Icon" />
            Loading <code>{uuid}</code>...
          </em>
        </div>
      );
    }

    if (error) {
      return (
        <div className="TodayReference__Error flex flex-align-items-center">
          <i className="fas fa-exclamation-circle TodayReference__Icon" />
          <span>
            Could not load <code>{uuid}</code>:<br />
            {error.message}
          </span>
        </div>
      );
    }

    if (!log) {
      return (
        <div className="TodayReference__Load text-muted">
          <button
            className="btn btn-outline-primary"
            onClick={() => this.load(uuid)}
          >
            Load <code>{uuid}</code>
          </button>
        </div>
      );
    }

    return <Markdown text={log.get('content')} autoLoadReferences={false} />;
  }

  render() {
    const { uuid } = this.props;
    const { hovered, error } = this.state;

    return (
      <div
        className={classNames('TodayReference', {
          'TodayReference--hover': hovered,
          TodayReference__Errored: error,
        })}
        onMouseOver={this.onMouseOver}
        onFocus={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onBlur={this.onMouseOut}
      >
        <Tooltip
          placement="bottom"
          mouseEnterDelay={0.3}
          overlay={uuid}
          visible={hovered}
        >
          {this.renderInternal()}
        </Tooltip>
      </div>
    );
  }
}

TodayReference.propTypes = {
  autoLoad: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
  fetchLog: PropTypes.func.isRequired,
};

TodayReference.defaultProps = {
  autoLoad: false,
};

export default props => (
  <TodayReference {...Object.assign({}, props, { fetchLog })} />
);
