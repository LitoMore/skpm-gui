// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { runTask, abortTask } from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';

import Module from '../Module';
import CommandRunnerPaneRow from '../CommandRunnerPaneRow';
import { StrokeButton } from '../Button';
import EditMenuModal from '../EditMenuModal';
import { SKPM_REPO_URL } from '../../constants';

import type { Project } from '../../types';

type Props = {
  project: Project,
};

type State = {
  selectedCommandId: ?string,
  editingMenu: boolean,
};

class CommandsPane extends Component<Props, State> {
  state = {
    selectedCommandId: null,
    editingMenu: false,
  };

  static getDerivedStateFromProps(props, state) {
    // It's possible that this task is deleted while the modal is open;
    // For example, This can happen when ejecting the project, since the
    // create-react-app "eject" task removes itself upon completion.
    const selectedCommandExists = props.project.commands.some(
      c => c.identifier === state.selectedCommandId
    );

    if (!selectedCommandExists) {
      return { selectedCommandId: null };
    }

    return null;
  }

  handleViewDetails = commandId => {
    this.setState({ selectedCommandId: commandId });
  };

  handleDismissTaskDetails = () => {
    this.setState({ selectedCommandId: null });
  };

  handleEditMenu = () => {
    this.setState({ editingMenu: true });
  };

  handleDismissEditMenu = () => {
    this.setState({ editingMenu: false });
  };

  render() {
    const { project } = this.props;
    const { selectedCommandId, editingMenu } = this.state;

    return (
      <Module
        title="Plugin Commands"
        moreInfoHref={`${SKPM_REPO_URL}/blob/master/docs/getting-started.md#commands`}
        primaryActionChildren={
          <StrokeButton onClick={this.handleEditMenu}>Edit menu</StrokeButton>
        }
      >
        {project.commands.map(command => (
          <CommandRunnerPaneRow
            key={command.identifier}
            identifier={command.identifier}
            name={command.name}
            status={command.status}
            processId={command.processId}
            onViewDetails={this.handleViewDetails}
          />
        ))}

        <EditMenuModal
          menu={project.pluginMenu}
          commands={project.commands}
          isVisible={!!editingMenu}
          onDismiss={this.handleDismissEditMenu}
        />
      </Module>
    );
  }
}

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(
  mapStateToProps,
  { runTask, abortTask }
)(CommandsPane);
