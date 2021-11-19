import { useContext } from 'react';
import ExtensionStorageContext, { ExtensionStorageContextProps } from './ExtensionStorageContext';

const useExtensionStorageContext = (): ExtensionStorageContextProps =>
  useContext(ExtensionStorageContext);

export default useExtensionStorageContext;
