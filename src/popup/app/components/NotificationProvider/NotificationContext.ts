import { createContext, Dispatch } from 'react';
import { State, ActionTypes } from './store';

export type NotificationContextProps = [State, Dispatch<ActionTypes>];

const NotificationContext = createContext<NotificationContextProps>([[], () => {}]);

export default NotificationContext;
