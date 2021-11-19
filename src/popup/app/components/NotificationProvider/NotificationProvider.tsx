import { FunctionComponent, SyntheticEvent, useReducer } from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { reducer, initialState, removeNotification } from './store';
import NotificationContext from './NotificationContext';

const NotificationProvider: FunctionComponent = ({ children }) => {
  const store = useReducer(reducer, initialState);
  const [notifications, dispatch] = store;
  const [currentNotification] = notifications;

  const handleClose = (_: SyntheticEvent, reason: SnackbarCloseReason): void => {
    if (reason !== 'timeout') {
      return;
    }
    dispatch(removeNotification());
  };

  return (
    <NotificationContext.Provider value={store}>
      {children}
      <Snackbar
        key={`${Math.random()}`}
        open={Boolean(currentNotification)}
        autoHideDuration={currentNotification?.duration || 3000}
        onClose={handleClose}
      >
        <Alert severity={currentNotification?.type || 'info'} variant="filled">
          {currentNotification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
