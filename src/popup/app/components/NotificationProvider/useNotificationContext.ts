import { useContext } from 'react';
import NotificationContext, { NotificationContextProps } from './NotificationContext';

const useNotificationContext = (): NotificationContextProps => useContext(NotificationContext);

export default useNotificationContext;
