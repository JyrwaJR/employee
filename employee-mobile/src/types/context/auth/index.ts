export type UserT = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export type AuthContextT = {
  isLoading: boolean;
  user: UserT | null | undefined;
  isSignedIn: boolean;
  refresh: () => void;
};
