import type { FC, ReactNode } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { CatalogPage } from './pages/CatalogPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ModeratorReviewsPage } from './pages/ModeratorReviewsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Role, type User } from './shared/types/domain';
import { AppLayout } from './layouts/app-layout/AppLayout';
import AuthLayout from './layouts/auth-layout/AuthLayout';
import { useAuth } from './features/auth/model/AuthContext';
import { HomePage } from './pages/HomePage';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: Role[];
  user: User | null;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, allowedRoles, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const RequireAuth: FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export const App: FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CatalogPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<div className="page-title">Профиль (скоро)</div>} />
          <Route
            path="/moderation/reviews"
            element={
              <ProtectedRoute user={user} allowedRoles={[Role.Moderator, Role.Admin]}>
                <ModeratorReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} allowedRoles={[Role.Admin]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
