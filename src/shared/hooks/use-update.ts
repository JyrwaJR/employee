import { useContext } from 'react';
import { UpdatesContext } from '@contexts/update.context';

export const useUpdates = () => {
  const context = useContext(UpdatesContext);
  if (context === undefined) {
    throw new Error('useUpdates must be used within an UpdatesProvider');
  }
  return context;
};
