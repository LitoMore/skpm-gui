// @flow
import uuid from 'uuid/v1';

import type {
  Command,
  AppSettings,
  Project,
  ProjectInternal,
  ProjectType,
  ProjectInternalsMap,
  Task,
  Dependency,
  QueuedDependency,
  PluginMenuRoot,
  PluginMenuRootInternal,
  Executable,
} from '../types';

//
// Action Types
//
export const REFRESH_PROJECTS_START = 'REFRESH_PROJECTS_START';
export const REFRESH_PROJECTS_ERROR = 'REFRESH_PROJECTS_ERROR';
export const REFRESH_PROJECTS_FINISH = 'REFRESH_PROJECTS_FINISH';
export const CREATE_NEW_PROJECT_START = 'CREATE_NEW_PROJECT_START';
export const CREATE_NEW_PROJECT_CANCEL = 'CREATE_NEW_PROJECT_CANCEL';
export const CREATE_NEW_PROJECT_FINISH = 'CREATE_NEW_PROJECT_FINISH';
export const ADD_PROJECT = 'ADD_PROJECT';
export const SHOW_MODAL = 'SHOW_MODAL';
export const CHANGE_PROJECT_HOME_PATH = 'CHANGE_PROJECT_HOME_PATH';
export const HIDE_MODAL = 'HIDE_MODAL';
export const DISMISS_SIDEBAR_INTRO = 'DISMISS_SIDEBAR_INTRO';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const RUN_TASK = 'RUN_TASK';
export const ATTACH_TASK_METADATA = 'ATTACH_TASK_METADATA';
export const ABORT_TASK = 'ABORT_TASK';
export const COMPLETE_TASK = 'COMPLETE_TASK';
export const RECEIVE_DATA_FROM_TASK_EXECUTION =
  'RECEIVE_DATA_FROM_TASK_EXECUTION';
export const LAUNCH_DEV_SERVER = 'LAUNCH_DEV_SERVER';
export const CLEAR_CONSOLE = 'CLEAR_CONSOLE';
export const LOAD_DEPENDENCY_INFO_FROM_DISK_START =
  'LOAD_DEPENDENCY_INFO_FROM_DISK_START';
export const LOAD_DEPENDENCY_INFO_FROM_DISK_FINISH =
  'LOAD_DEPENDENCY_INFO_FROM_DISK_FINISH';
export const ADD_DEPENDENCY = 'ADD_DEPENDENCY';
export const UPDATE_DEPENDENCY = 'UPDATE_DEPENDENCY';
export const DELETE_DEPENDENCY = 'DELETE_DEPENDENCY';
export const INSTALL_DEPENDENCIES_START = 'INSTALL_DEPENDENCIES_START';
export const INSTALL_DEPENDENCIES_ERROR = 'INSTALL_DEPENDENCIES_ERROR';
export const INSTALL_DEPENDENCIES_FINISH = 'INSTALL_DEPENDENCIES_FINISH';
export const UNINSTALL_DEPENDENCIES_START = 'UNINSTALL_DEPENDENCIES_START';
export const UNINSTALL_DEPENDENCIES_ERROR = 'UNINSTALL_DEPENDENCIES_ERROR';
export const UNINSTALL_DEPENDENCIES_FINISH = 'UNINSTALL_DEPENDENCIES_FINISH';
export const QUEUE_DEPENDENCY_INSTALL = 'QUEUE_DEPENDENCY_INSTALL';
export const QUEUE_DEPENDENCY_UNINSTALL = 'QUEUE_DEPENDENCY_UNINSTALL';

export const START_NEXT_ACTION_IN_QUEUE = 'START_NEXT_ACTION_IN_QUEUE';
export const SHOW_IMPORT_EXISTING_PROJECT_PROMPT =
  'SHOW_IMPORT_EXISTING_PROJECT_PROMPT';
export const IMPORT_EXISTING_PROJECT_START = 'IMPORT_EXISTING_PROJECT_START';
export const IMPORT_EXISTING_PROJECT_ERROR = 'IMPORT_EXISTING_PROJECT_ERROR';
export const IMPORT_EXISTING_PROJECT_FINISH = 'IMPORT_EXISTING_PROJECT_FINISH';
export const SHOW_DELETE_PROJECT_PROMPT = 'SHOW_DELETE_PROJECT_PROMPT';
export const START_DELETING_PROJECT = 'START_DELETING_PROJECT';
export const FINISH_DELETING_PROJECT = 'FINISH_DELETING_PROJECT';
export const DELETE_PROJECT_ERROR = 'DELETE_PROJECT_ERROR';
export const SHOW_RESET_STATE_PROMPT = 'SHOW_RESET_STATE_PROMPT';
export const RESET_ALL_STATE = 'RESET_ALL_STATE';

export const DELETE_COMMAND_START = 'DELETE_COMMAND_START';
export const DELETE_COMMAND_ERROR = 'DELETE_COMMAND_ERROR';
export const DELETE_COMMAND_FINISH = 'DELETE_COMMAND_FINISH';
export const UPDATE_COMMAND_START = 'UPDATE_COMMAND_START';
export const UPDATE_COMMAND_ERROR = 'UPDATE_COMMAND_ERROR';
export const UPDATE_COMMAND_FINISH = 'UPDATE_COMMAND_FINISH';
export const ADD_COMMAND_START = 'ADD_COMMAND_START';
export const ADD_COMMAND_ERROR = 'ADD_COMMAND_ERROR';
export const ADD_COMMAND_FINISH = 'ADD_COMMAND_FINISH';
export const RUN_COMMAND = 'RUN_COMMAND';
export const ATTACH_COMMAND_METADATA = 'ATTACH_COMMAND_METADATA';
export const ABORT_COMMAND = 'ABORT_COMMAND';
export const COMPLETE_COMMAND = 'COMPLETE_COMMAND';
export const RECEIVE_DATA_FROM_COMMAND_EXECUTION =
  'RECEIVE_DATA_FROM_COMMAND_EXECUTION';

// project config related actions
export const SHOW_PROJECT_SETTINGS = 'SHOW_PROJECT_SETTINGS';
export const SAVE_PROJECT_SETTINGS_START = 'SAVE_PROJECT_SETTINGS_START';
export const SAVE_PROJECT_SETTINGS_ERROR = 'SAVE_PROJECT_SETTINGS_ERROR';
export const SAVE_PROJECT_SETTINGS_FINISH = 'SAVE_PROJECT_SETTINGS_FINISH';

// plugin menu
export const SHOW_PLUGIN_MENU = 'SHOW_PLUGIN_MENU';
export const SAVE_PLUGIN_MENU_START = 'SAVE_PLUGIN_MENU_START';
export const SAVE_PLUGIN_MENU_ERROR = 'SAVE_PLUGIN_MENU_ERROR';
export const SAVE_PLUGIN_MENU_FINISH = 'SAVE_PLUGIN_MENU_FINISH';

// app settings
export const SHOW_APP_SETTINGS = 'SHOW_APP_SETTINGS';
export const SAVE_APP_SETTINGS_START = 'SAVE_APP_SETTINGS_START';
export const CHANGE_DEFAULT_PROJECT_PATH = 'CHANGE_DEFAULT_PROJECT_PATH';
//
//
// Action Creators
//
export const addProject = (
  project: ProjectInternal,
  projectHomePath: string,
  projectType: ProjectType,
  isOnboardingCompleted: boolean
) => ({
  type: ADD_PROJECT,
  project,
  projectHomePath,
  projectType,
  isOnboardingCompleted,
});

export const refreshProjectsStart = () => ({
  type: REFRESH_PROJECTS_START,
});

export const refreshProjectsError = (error: string) => ({
  type: REFRESH_PROJECTS_ERROR,
  error,
});

export const refreshProjectsFinish = (projects: ProjectInternalsMap) => ({
  type: REFRESH_PROJECTS_FINISH,
  projects,
});

/**
 * This action figures out what dependencies are installed for a given
 * projectId.
 *
 * TODO: we should show some loading UI while it works.
 *
 */

export const loadDependencyInfoFromDiskStart = (
  projectId: string,
  projectPath: string
) => ({
  type: LOAD_DEPENDENCY_INFO_FROM_DISK_START,
  projectId,
  projectPath,
});

export const loadDependencyInfoFromDiskFinish = (
  projectId: string,
  dependencies: {
    [dependencyName: string]: Dependency,
  }
) => ({
  type: LOAD_DEPENDENCY_INFO_FROM_DISK_FINISH,
  projectId,
  dependencies,
});

export const createNewProjectStart = () => ({
  type: CREATE_NEW_PROJECT_START,
});

export const createNewProjectCancel = () => ({
  type: CREATE_NEW_PROJECT_CANCEL,
});

export const createNewProjectFinish = () => ({
  type: CREATE_NEW_PROJECT_FINISH,
});

export const dismissSidebarIntro = () => ({
  type: DISMISS_SIDEBAR_INTRO,
});

export const selectProject = (projectId: string) => ({
  type: SELECT_PROJECT,
  projectId,
});

export const runTask = (task: Task, timestamp: Date) => ({
  type: RUN_TASK,
  task,
  timestamp,
});

export const attachTaskMetadata = (task: Task, processId: number) => ({
  type: ATTACH_TASK_METADATA,
  task,
  processId,
});

export const abortTask = (
  task: Task,
  projectType: ProjectType,
  timestamp: Date
) => ({
  type: ABORT_TASK,
  task,
  projectType,
  timestamp,
});

export const completeTask = (
  task: Task,
  timestamp: Date,
  wasSuccessful: boolean
) => ({
  type: COMPLETE_TASK,
  task,
  timestamp,
  wasSuccessful,
});

export const receiveDataFromTaskExecution = (
  task: Task,
  text: string,
  isError?: boolean
) => ({
  type: RECEIVE_DATA_FROM_TASK_EXECUTION,
  task,
  text,
  isError,
  logId: uuid(),
});

export const launchDevServer = (task: Task, timestamp: Date) => ({
  type: LAUNCH_DEV_SERVER,
  task,
  timestamp,
});

export const clearConsole = (executable: Executable) => ({
  type: CLEAR_CONSOLE,
  executable,
});

export const addDependency = (
  projectId: string,
  dependencyName: string,
  version: string
) => ({
  type: ADD_DEPENDENCY,
  projectId,
  dependencyName,
  version,
});

export const updateDependency = (
  projectId: string,
  dependencyName: string,
  latestVersion: string
) => ({
  type: UPDATE_DEPENDENCY,
  projectId,
  dependencyName,
  latestVersion,
});

export const deleteDependency = (
  projectId: string,
  dependencyName: string
) => ({
  type: DELETE_DEPENDENCY,
  projectId,
  dependencyName,
});

export const installDependenciesStart = (
  projectId: string,
  dependencies: Array<QueuedDependency>
) => ({
  type: INSTALL_DEPENDENCIES_START,
  projectId,
  dependencies,
});

export const installDependenciesError = (
  projectId: string,
  dependencies: Array<QueuedDependency>
) => ({
  type: INSTALL_DEPENDENCIES_ERROR,
  projectId,
  dependencies,
});

export const installDependenciesFinish = (
  projectId: string,
  dependencies: Array<Dependency>
) => ({
  type: INSTALL_DEPENDENCIES_FINISH,
  projectId,
  dependencies,
});

export const uninstallDependenciesStart = (
  projectId: string,
  dependencies: Array<QueuedDependency>
) => ({
  type: UNINSTALL_DEPENDENCIES_START,
  projectId,
  dependencies,
});

export const uninstallDependenciesError = (
  projectId: string,
  dependencies: Array<QueuedDependency>
) => ({
  type: UNINSTALL_DEPENDENCIES_ERROR,
  projectId,
  dependencies,
});

export const uninstallDependenciesFinish = (
  projectId: string,
  dependencies: Array<QueuedDependency>
) => ({
  type: UNINSTALL_DEPENDENCIES_FINISH,
  projectId,
  dependencies,
});

export const queueDependencyInstall = (
  projectId: string,
  name: string,
  version: string,
  updating?: boolean
) => ({
  type: QUEUE_DEPENDENCY_INSTALL,
  projectId,
  name,
  version,
  updating,
});

export const queueDependencyUninstall = (projectId: string, name: string) => ({
  type: QUEUE_DEPENDENCY_UNINSTALL,
  projectId,
  name,
});

export const startNextActionInQueue = (projectId: string) => ({
  type: START_NEXT_ACTION_IN_QUEUE,
  projectId,
});

export const showImportExistingProjectPrompt = () => ({
  type: SHOW_IMPORT_EXISTING_PROJECT_PROMPT,
});

export const importExistingProjectStart = (path: string) => ({
  type: IMPORT_EXISTING_PROJECT_START,
  path,
});

export const importExistingProjectError = () => ({
  type: IMPORT_EXISTING_PROJECT_ERROR,
});

export const importExistingProjectFinish = (
  projectPath: string,
  project: ProjectInternal,
  isOnboardingCompleted: boolean
) => ({
  type: IMPORT_EXISTING_PROJECT_FINISH,
  projectPath,
  project,
  isOnboardingCompleted,
});

export const showDeleteProjectPrompt = (project: Project) => ({
  type: SHOW_DELETE_PROJECT_PROMPT,
  project,
});

export const showProjectSettings = () => ({
  type: SHOW_PROJECT_SETTINGS,
});

export const hideModal = () => ({
  type: HIDE_MODAL,
});

// app settings
export const showAppSettings = () => ({
  type: SHOW_APP_SETTINGS,
});

export const saveAppSettingsStart = (settings: AppSettings) => ({
  type: SAVE_APP_SETTINGS_START,
  settings,
});

export const changeDefaultProjectPath = (defaultProjectPath: string) => ({
  type: CHANGE_DEFAULT_PROJECT_PATH,
  defaultProjectPath,
});

// project settings related actions
export const saveProjectSettingsStart = (
  name: string,
  metadata: {
    projectIcon: string,
    homepage: string,
    description: string,
  },
  project: Project
) => ({
  type: SAVE_PROJECT_SETTINGS_START,
  name,
  metadata,
  project,
});

export const saveProjectSettingsFinish = (
  oldId: string,
  id: string,
  name: string,
  metadata: {
    projectIcon: string,
    homepage: string,
    description: string,
  },
  projectPath: string
) => ({
  type: SAVE_PROJECT_SETTINGS_FINISH,
  oldId,
  id,
  name,
  metadata,
  projectPath,
});

export const showPluginMenu = () => ({
  type: SHOW_PLUGIN_MENU,
});

export const savePluginMenuStart = (
  menu: PluginMenuRoot | void,
  project: Project
) => ({
  type: SAVE_PLUGIN_MENU_START,
  menu,
  project,
});

export const savePluginMenuFinish = (
  menu: PluginMenuRootInternal | void,
  project: Project
) => ({
  type: SAVE_PLUGIN_MENU_FINISH,
  menu,
  project,
});

export const startDeletingProject = () => ({
  type: START_DELETING_PROJECT,
});

export const finishDeletingProject = (projectId: string) => ({
  type: FINISH_DELETING_PROJECT,
  projectId,
});

export const deleteProjectError = () => ({
  type: DELETE_PROJECT_ERROR,
});

export const showResetStatePrompt = () => ({
  type: SHOW_RESET_STATE_PROMPT,
});

export const resetAllState = () => ({ type: RESET_ALL_STATE });

export const addCommand = (
  project: Project,
  identifier: string,
  name: string,
  shortcut: string | null
) => ({
  type: ADD_COMMAND_START,
  project,
  identifier,
  name,
  shortcut,
});

export const addCommandError = (project: Project, identifier: string) => ({
  type: ADD_COMMAND_ERROR,
  project,
  identifier,
});

export const addCommandFinish = (project: Project, identifier: string) => ({
  type: ADD_COMMAND_FINISH,
  project,
  identifier,
});

export const runCommand = (
  project: Project,
  command: Command,
  timestamp: Date
) => ({
  type: RUN_COMMAND,
  project,
  command,
  timestamp,
});

export const attachCommandMetadata = (command: Command, processId: number) => ({
  type: ATTACH_COMMAND_METADATA,
  command,
  processId,
});

export const abortCommand = (command: Command, timestamp: Date) => ({
  type: ABORT_COMMAND,
  command,
  timestamp,
});

export const completeCommand = (
  command: Command,
  timestamp: Date,
  wasSuccessful: boolean
) => ({
  type: COMPLETE_COMMAND,
  command,
  timestamp,
  wasSuccessful,
});

export const receiveDataFromCommandExecution = (
  command: Command,
  text: string,
  isError?: boolean
) => ({
  type: RECEIVE_DATA_FROM_COMMAND_EXECUTION,
  command,
  text,
  isError,
  logId: uuid(),
});
