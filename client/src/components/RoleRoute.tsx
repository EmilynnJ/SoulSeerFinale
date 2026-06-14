// ============================================================
// RoleRoute — gates a route to specific user roles.
//
// ProtectedRoute only checks that the user is authenticated with Auth0.
// RoleRoute additionally requires the synced internal user to have one of
// the allowed roles, so e.g. a client can't open /dashboard/admin. Users
// with the wrong role are redirected to their OWN dashboard rather than
// being shown another role's shell.
// ============================================================

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, LoadingPage } from './ui';

type Role = 'admin' | 'reader' | 'client';

function dashboardPathFor(role: Role): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'reader':
      return '/dashboard/reader';
    default:
      return '/dashboard/client';
  }
}

interface RoleRouteProps {
  allow: Role[];
  children: ReactNode;
}

export function RoleRoute({ allow, children }: RoleRouteProps) {
  const { user, isAuthenticated, auth0IsAuthenticated, isLoading, authError, refreshUser, logout } = useAuth();

  if (isLoading) {
    return <LoadingPage message="Loading your dashboard..." />;
  }

  // Auth0 session exists but the backend user sync failed — show a
  // recoverable error screen instead of redirecting to /login (which
  // would re-trigger Auth0 and cause an infinite redirect loop).
  if (auth0IsAuthenticated && authError) {
    return (
      <div className="page-enter">
        <div className="container" style={{ maxWidth: 560, paddingTop: '4rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 className="heading-2">We couldn't load your profile</h1>
            <p className="login-cosmic__text" style={{ marginBottom: '1rem' }}>
              You are signed in with Auth0, but the SoulSeer API returned an
              error while syncing your account.
            </p>
            <p className="caption" style={{ marginBottom: '1.5rem' }}>
              {authError}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => refreshUser?.()}>
                Retry
              </Button>
              <Button variant="ghost" onClick={() => logout()}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in (or the backend user record never loaded) — send to /login.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Signed in but wrong role — bounce to the user's own dashboard.
  if (!allow.includes(user.role as Role)) {
    return <Navigate to={dashboardPathFor(user.role as Role)} replace />;
  }

  return <>{children}</>;
}
