import { LoginFormView } from '@/components/auth/LoginFormView';

/** Internal team login — share /auth/login/internal directly; not linked from public UI */
export default function InternalLoginPage() {
  return <LoginFormView fixedRole="super_admin" />;
}
