// @flow
import * as path from 'path';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import produce from 'immer';

import {
  ADD_PROJECT,
  IMPORT_EXISTING_PROJECT_FINISH,
  FINISH_DELETING_PROJECT,
  INSTALL_DEPENDENCIES_FINISH,
  REFRESH_PROJECTS_FINISH,
  SAVE_PROJECT_SETTINGS_FINISH,
  SAVE_PLUGIN_MENU_FINISH,
  SELECT_PROJECT,
  RESET_ALL_STATE,
} from '../actions';
import { getTasks, getTasksForProjectId } from './tasks.reducer';
import {
  getDependencies,
  getDependenciesForProjectId,
} from './dependencies.reducer';
import { getPaths, getPathForProjectId } from './paths.reducer';
import { getCommands, getCommandsForProjectId } from './commands.reducer';

import { internalMenuToMenu } from '../services/plugin-menu.service';

import type { Action } from 'redux';
import type { ProjectInternal, Project } from '../types';

type ById = {
  [key: string]: ProjectInternal,
};

type SelectedId = ?string;

type State = {
  byId: ById,
  selectedId: SelectedId,
};

export const initialState = {
  byId: {},
  selectedId: null,
};

const byIdReducer = (state: ById = initialState.byId, action: Action = {}) => {
  switch (action.type) {
    case REFRESH_PROJECTS_FINISH: {
      return action.projects;
    }

    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      return {
        ...state,
        [action.project.name]: action.project,
      };
    }

    case INSTALL_DEPENDENCIES_FINISH: {
      const { projectId, dependencies } = action;

      return produce(state, draftState => {
        dependencies.forEach(dependency => {
          if (!draftState[projectId].dependencies) {
            draftState[projectId].dependencies = {};
          }
          draftState[projectId].dependencies[dependency.name] =
            dependency.version;
        });
      });
    }

    case FINISH_DELETING_PROJECT: {
      const { projectId } = action;

      return produce(state, draftState => {
        delete draftState[projectId];
      });
    }

    case SAVE_PROJECT_SETTINGS_FINISH: {
      const { oldId, id, name, icon } = action;

      return produce(state, draftState => {
        delete draftState[oldId];
        draftState[id] = state[oldId];
        draftState[id].name = id;
        if (!draftState[id].skpm) {
          draftState[id].skpm = {};
        }
        draftState[id].skpm.name = name;
        draftState[id].__skpm_icon = icon;
      });
    }

    case SAVE_PLUGIN_MENU_FINISH: {
      const { menu, project } = action;
      const { id } = project;

      return produce(state, draftState => {
        if (!draftState[id].__skpm_manifest) {
          draftState[id].__skpm_manifest = {};
        }
        draftState[id].__skpm_manifest.menu = menu;
      });
    }

    case RESET_ALL_STATE:
      return initialState.byId;

    default:
      return state;
  }
};

const selectedIdReducer = (
  state: SelectedId = initialState.selectedId,
  action: Action = {}
) => {
  switch (action.type) {
    case ADD_PROJECT:
    case IMPORT_EXISTING_PROJECT_FINISH: {
      // When a new project is created/imported, we generally want to select
      // it! The only exception is during onboarding. We want the user to
      // manually click the icon, to teach them what these icons are.
      //
      // NOTE: This is knowable because after onboarding, a project will
      // _always_ be selected. This is a fundamental truth about how Guppy
      // works. In the future, though, we may want to have non-project screens,
      // and so this will have to be rethought.
      return action.isOnboardingCompleted ? action.project.name : null;
    }

    case REFRESH_PROJECTS_FINISH: {
      // It's possible that the selected project no longer exists (say if the
      // user deletes that folder and then refreshes Guppy).
      // In that case, un-select it.
      const selectedProjectId = state;

      if (!selectedProjectId) {
        return state;
      }

      const selectedProjectExists = !!action.projects[selectedProjectId];

      return selectedProjectExists ? state : null;
    }

    case SAVE_PROJECT_SETTINGS_FINISH: {
      return action.id;
    }

    case SELECT_PROJECT: {
      return action.projectId;
    }

    case FINISH_DELETING_PROJECT: {
      // Right now, it is only possible to delete the currently-selected
      // project, so this condition will always be true. This is a guard against
      // future changes.
      const justDeletedSelectedProject = action.projectId === state;

      return justDeletedSelectedProject ? null : state;
    }

    case RESET_ALL_STATE: {
      return initialState.selectedId;
    }

    default:
      return state;
  }
};

export default combineReducers({
  byId: byIdReducer,
  selectedId: selectedIdReducer,
});

//
//
//
// Selectors
type GlobalState = { projects: State };

const mapObjectToArray = <T>(obj: { [string]: T }): Array<T> => {
  return obj ? Object.keys(obj).map(key => obj[key]) : [];
};

// Our projects in-reducer are essentially database items that represent the
// package.json on disk.
//
// For using within the app, though, we can do a few things to make it nicer
// to work with:
//
//  - Combine it with the tasks in `tasks.reducer`, since this is much more
//    useful than project.scripts
//  - Combine it with the dependencies in `dependencies.reducer`
//  - Fetch the project's on-disk path from `paths.reducer`
//  - Serve a minimal subset of the `project` fields, avoiding the weirdness
//    with multiple names, and all the raw unnecessary package.json data.
const prepareProjectForConsumption = (
  project: ProjectInternal,
  tasks,
  dependencies,
  projectPath,
  commandsMap
): Project => {
  const commands = mapObjectToArray(commandsMap);
  return {
    id: project.name,
    name: (project.skpm || {}).name || project.name,
    // prettier-ignore
    tasks: mapObjectToArray(tasks),
    dependencies: mapObjectToArray(dependencies),
    path: projectPath,
    manifestPath: path.join(projectPath, (project.skpm || {}).manifest || ''),
    icon: project.__skpm_icon,
    createdAt: project.__skpm_createdAt,
    commands,
    pluginMenu: internalMenuToMenu(project, commands),
  };
};

export const getById = (state: GlobalState) => state.projects.byId;
export const getSelectedProjectId = (state: GlobalState) =>
  state.projects.selectedId;

export const getInternalProjectById = (
  state: GlobalState,
  props: { projectId: string }
) => getById(state)[props.projectId];

export const getProjectsArray = createSelector(
  [getById, getTasks, getDependencies, getPaths, getCommands],
  (byId, tasks, dependencies, paths, commands) => {
    return Object.keys(byId)
      .map(projectId => {
        const project = byId[projectId];

        return prepareProjectForConsumption(
          project,
          tasks[projectId],
          dependencies[projectId],
          paths[projectId],
          commands[projectId]
        );
      })
      .sort((p1, p2) => (p1.createdAt < p2.createdAt ? 1 : -1));
  }
);

export const getProjectById = createSelector(
  [
    getInternalProjectById,
    getTasksForProjectId,
    getDependenciesForProjectId,
    getPathForProjectId,
    getCommandsForProjectId,
  ],
  (internalProject, tasks, dependencies, projectPath, commands) => {
    if (!internalProject) {
      return null;
    }

    return prepareProjectForConsumption(
      internalProject,
      tasks,
      dependencies,
      projectPath,
      commands
    );
  }
);

export const getSelectedProject = (state: GlobalState) => {
  const selectedId = getSelectedProjectId(state);

  if (!selectedId) {
    return null;
  }

  return getProjectById(state, { projectId: selectedId });
};

export const getDependencyMapForSelectedProject = (state: GlobalState) => {
  const projectId = getSelectedProjectId(state);

  if (!projectId) {
    return [];
  }

  return getDependenciesForProjectId(state, { projectId });
};
