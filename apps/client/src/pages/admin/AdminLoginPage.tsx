import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export function AdminLoginPage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  if (user) return <Navigate to="/admin" replace />;
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get('email')), String(form.get('password')));
      const target = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/admin';
      navigate(target, { replace: true });
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Login failed'); }
    finally { setLoading(false); }
  };
  return <div className="admin-login"><div className="login-glow" /><form className="login-card" onSubmit={submit}><div className="login-icon"><LockKeyhole /></div><span className="eyebrow">SECURE ACCESS</span><h1>NEXUS Admin</h1><p>Manage every page, project, publication, event, blog and site setting.</p><label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" minLength={8} required /></label><button className="button primary" disabled={loading}>{loading ? 'Authenticating...' : 'Enter control room'}</button><a href="/">← Return to portfolio</a></form></div>;
}
