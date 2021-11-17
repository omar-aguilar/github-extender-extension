import { useContext } from 'react';
import AppContext, { AppContextProps } from './AppContext';

const useAppContext = (): AppContextProps => useContext(AppContext);

export default useAppContext;
