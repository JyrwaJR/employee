# Project Conventions

## Routing & Authentication

### Role-Based Access Control (RBAC) Pattern
This component manages screen access based on authentication state and roles.

**Key Features:**
- **Redirect Back**: Captures the attempted path in `redirect` search param and returns user there after login.
- **Unauthenticated-Only Pages**: Protects pages like `/signin` and `/signup` from already logged-in users.
- **Route Roles**: Looks up current path in a `routeRoles` configuration to determine `needAuth` and permitted types.

```typescript
// Pattern: RoleBaseRoute implementation
// (refer to this when building navigation or protected routes)

type PropsT = {
  children: React.ReactNode;
};

const pageAccessOnlyIfUnAuthenticated: string[] = [
  "/signin",
  "/signup",
  "/reset-password",
  "/verify-email",
];

export const RoleBaseRoute = ({ children }: PropsT) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  const userRoles = useMemo(() => user?.role || [], [user]);
  const isAuthenticated = !!(user && cookies.AUTH_TOKEN);

  // Show loader during route changes or delays
  useEffect(() => {
    if (isAuthLoading) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [isAuthLoading, pathName]);

  // Handle authentication and role-based redirects
  useEffect(() => {
    if (isAuthLoading) return;

    const currentRoute = routeRoles.find((route) => {
      if (route.url === pathName) return true;
      if (route.url.endsWith("/*")) {
        const basePath = route.url.replace("/*", "");
        return pathName.startsWith(basePath);
      }
      return false;
    });

    if (currentRoute) {
      if (currentRoute.needAuth && !isAuthenticated) {
        router.replace(`/signin?redirect=${encodeURIComponent(pathName)}`);
        return;
      }

      if (isAuthenticated) {
        const hasRequiredRole = currentRoute.role.some((role) =>
          userRoles.includes(role),
        );

        if (!hasRequiredRole) {
          router.replace(currentRoute.redirect || "/");
          return;
        }
      }
    }
  }, [pathName, isAuthenticated, userRoles, router, isAuthLoading]);

  useEffect(() => {
    if (isAuthLoading || isLoading) return;
    if (isAuthenticated && pageAccessOnlyIfUnAuthenticated.includes(pathName)) {
      router.push(redirectTo || "/");
    }
  }, [isAuthenticated, pathName, redirectTo, router, isAuthLoading, isLoading]);

  if (isAuthLoading || isLoading) {
    return <PreLoader />;
  }

  return <>{children}</>;
};
```
