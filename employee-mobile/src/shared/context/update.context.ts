import { createContext } from 'react';

interface UpdatesContextType {
  isUpdateAvailable: boolean;
  isUpdateReady: boolean;
  isDownloading: boolean;
  updateError: string | null;
  checkAndDownloadUpdate: () => Promise<void>;
  runUpdate: () => Promise<void>;
  skipUpdate: () => void;
}

export const UpdatesContext = createContext<UpdatesContextType | undefined>(undefined);
