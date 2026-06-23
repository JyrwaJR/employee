import { useAuthStore } from '@stores/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const isLoading = useAuthStore((s) => s.isAuthLoading);
  const role = useAuthStore((s) => s.role);
  const refresh = useAuthStore((s) => s.refresh);
  const logout = useAuthStore((s) => s.logout);

  return { user, isSignedIn, isLoading, role, refresh, logout };
}
