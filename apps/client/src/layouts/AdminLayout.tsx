import { Archive, FileStack, Gauge, Image, LogOut, Menu, MessageSquare, Settings, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate('/admin/login'); };
  const links = [
    ['/admin', 'Dashboard', Gauge], ['/admin/content', 'Content', Archive], ['/admin/pages', 'Pages', FileStack],
    ['/admin/settings', 'Site settings', Settings], ['/admin/media', 'Media', Image], ['/admin/messages', 'Messages', MessageSquare]
  ] as const;
  return <div className="admin-shell">
    <aside className={open ? 'admin-sidebar open' : 'admin-sidebar'}>
      <div className="admin-brand"><span>N//</span><div><b>NEXUS ADMIN</b><small>Content operating system</small></div><button onClick={() => setOpen(false)}><X /></button></div>
      <nav>{links.map(([path, label, Icon]) => <NavLink end={path === '/admin'} key={path} to={path} onClick={() => setOpen(false)}><Icon size={18} />{label}</NavLink>)}</nav>
      <div className="admin-user"><div><strong>{user?.name}</strong><span>{user?.email}</span></div><button onClick={signOut} title="Sign out"><LogOut size={18} /></button></div>
    </aside>
    <main className="admin-main"><header className="admin-mobile-header"><button onClick={() => setOpen(true)}><Menu /></button><b>NEXUS ADMIN</b></header><Outlet /></main>
  </div>;
}
