// @flow
import {
  START_CREATING_NEW_PROJECT,
  CANCEL_CREATING_NEW_PROJECT,
  DISMISS_SIDEBAR_INTRO,
  ADD_PROJECT,
} from '../actions';

import type { Action } from 'redux';

export type State =
  | 'brand-new'
  | 'creating-first-project'
  | 'introducing-sidebar'
  | 'done';

// TODO: Pull this from localStorage
const initialState = 'brand-new';

export default (state: State = initialState, action: Action) => {
  if (state === 'done') {
    return state;
  }

  switch (action.type) {
    case START_CREATING_NEW_PROJECT: {
      return state === 'brand-new' ? 'creating-first-project' : state;
    }

    case CANCEL_CREATING_NEW_PROJECT: {
      return state === 'creating-first-project' ? 'brand-new' : state;
    }

    case ADD_PROJECT: {
      return state === 'creating-first-project' ? 'introducing-sidebar' : state;
    }

    case DISMISS_SIDEBAR_INTRO: {
      return state === 'introducing-sidebar' ? 'done' : state;
    }

    default:
      return state;
  }
};

type GlobalState = { onboardingStatus: State };

export const getOnboardingStatus = (state: GlobalState) =>
  state.onboardingStatus;

export const getSidebarVisibility = (state: GlobalState) =>
  state.onboardingStatus === 'introducing-sidebar' ||
  state.onboardingStatus === 'done';