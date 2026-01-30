export type UserT = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  avatar: string;
  location: string;
  phone: string;
  department: string;
  employee_id: string;
};

export type AuthContextT = {
  isLoading: boolean;
  user: UserT | null | undefined;
  isSignedIn: boolean;
  refresh: () => void;
};
