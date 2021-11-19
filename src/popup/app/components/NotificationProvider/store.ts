import { AlertColor } from '@mui/material/Alert';
import { drop, append } from 'ramda';

type Notification = {
  message: string;
  duration?: number;
  type?: AlertColor;
};

export type State = Notification[];

type AddNotification = {
  type: typeof ADD_NOTIFICATION;
  payload: Notification;
};

type RemoveNotification = {
  type: typeof REMOVE_NOTIFICATION;
};

export type ActionTypes = AddNotification | RemoveNotification;

const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export const initialState: State = [];

export function reducer(state = initialState, action: ActionTypes): State {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      const newState = append(action.payload, state);
      return newState;
    }
    case REMOVE_NOTIFICATION: {
      const newState = drop(1, state);
      return newState;
    }
    default:
      return state;
  }
}

export const addNotification = (notification: Notification): AddNotification => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const removeNotification = (): RemoveNotification => ({
  type: REMOVE_NOTIFICATION,
});
