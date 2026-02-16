export interface LocalAuthContextType {
  isSupported: boolean;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  authenticate: () => Promise<boolean>;
}
