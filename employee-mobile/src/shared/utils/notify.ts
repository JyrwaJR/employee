import { toast } from 'sonner-native';
import { NOTIFY, NotificationKey } from '../constants/notifications';
import { ApiResponse } from '../types/api';

/**
 * Intelligent Toast Dispatcher
 * Automatically handles Branded Titles, Descriptions, and Fallbacks.
 * 
 * @param response - The API response object from the http utility
 * @param key - The targeted branding key from NOTIFY registry
 */
export const notify = <T>(
  response: ApiResponse<T> | any,
  key: NotificationKey
) => {
  const config = NOTIFY[key];
  
  if (!config) {
    console.warn(`Notify: Key "${key}" not found in registry.`);
    return toast.error(NOTIFY.SYSTEM_ERROR.error_title, { 
      description: response?.message || NOTIFY.SYSTEM_ERROR.error_msg 
    });
  }

  const isSuccess = response?.success ?? false;

  // Resolve Title & Description logic:
  // 1. Title comes from feature config
  // 2. Description: Server Message > Feature Fallback > System Fallback
  const title = isSuccess ? config.success_title : config.error_title;
  const description = 
    response?.message || 
    (isSuccess 
      ? (config as any).success_msg || NOTIFY.SYSTEM_ERROR.success_msg 
      : (config as any).error_msg || NOTIFY.SYSTEM_ERROR.error_msg);
  
  if (isSuccess) {
    return toast.success(title, { description });
  } else {
    return toast.error(title, { description });
  }
};
