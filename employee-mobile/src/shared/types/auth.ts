export type RoleT = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type UserT = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: RoleT;
  avatar: string;
  location: string;
  phone: string;
  department: string;
  employee_id: string;
  auth: {
    id: number;
    email: string;   
  };
};

export type AuthContextT = {
  isLoading: boolean;
  user: UserT | null | undefined;
  isSignedIn: boolean;
  role: RoleT;
  refresh: () => void;
};

export interface LocalAuthContextType {
  isSupported: boolean;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  authenticate: () => Promise<boolean>;
}
