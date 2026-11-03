import { LoginFormView } from '@/components/auth/LoginFormView';

/** Coordinator login - share /auth/login/coordinator directly; not linked from public UI */
export default function CoordinatorLoginPage() {
  return <LoginFormView fixedRole="admin" />;
}
