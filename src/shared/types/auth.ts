export type RoleT = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type UserT = {
  id: number;
  emp_cd: string;
  emp_fname: string;
  emp_mname: string;
  emp_lname: string;
  emp_birth_dt: string;
  emp_sex: 'M' | 'F' | 'O';
  role: RoleT;
};

export type AuthContextT = {
  isLoading: boolean;
  user: UserT | null | undefined;
  isSignedIn: boolean;
  role: RoleT;
  refresh: () => void;
  logout: () => void;
};

export interface LocalAuthContextType {
  isSupported: boolean;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  authenticate: () => Promise<boolean>;
}
