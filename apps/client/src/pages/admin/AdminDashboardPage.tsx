import { Archive, FileImage, FileStack, MessageSquare, Radio } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ContactMessage } from '../../types';

interface DashboardData { contentCounts: Array<{ _id: string; count: number }>; unreadMessages: number; totalPages: number; recentMessages: ContactMessage[]; mediaCount: number }

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: async () => (await api.get<DashboardData>('/admin/dashboard')).data });
  const contentTotal = data?.contentCounts.reduce((sum, item) => sum + item.count, 0) || 0;
  return <div className="admin-page"><AdminHeader eyebrow="CONTROL ROOM" title="Dashboard" description="A live overview of the portfolio content system." />
    <div className="admin-stat-grid"><Stat icon={<Archive />} label="Content records" value={isLoading ? '-' : String(contentTotal)} /><Stat icon={<FileStack />} label="Editable pages" value={isLoading ? '-' : String(data?.totalPages || 0)} /><Stat icon={<MessageSquare />} label="New messages" value={isLoading ? '-' : String(data?.unreadMessages || 0)} /><Stat icon={<FileImage />} label="Media assets" value={isLoading ? '-' : String(data?.mediaCount || 0)} /><Stat icon={<Radio />} label="System" value="Online" /></div>
    <div className="admin-grid two"><section className="admin-panel"><div className="admin-panel-title"><h2>Content distribution</h2><Link to="/admin/content">Manage all</Link></div><div className="distribution-list">{data?.contentCounts.map((item) => <div key={item._id}><span>{item._id}</span><strong>{item.count}</strong><i style={{ width: `${Math.min(item.count * 12, 100)}%` }} /></div>)}</div></section>
      <section className="admin-panel"><div className="admin-panel-title"><h2>Recent transmissions</h2><Link to="/admin/messages">Open inbox</Link></div>{!data?.recentMessages.length ? <p className="muted">No contact messages yet.</p> : <div className="message-preview-list">{data.recentMessages.map((message) => <div key={message._id}><span className={`message-state ${message.status}`} /> <div><strong>{message.subject}</strong><small>{message.name} - {new Date(message.createdAt).toLocaleDateString()}</small></div></div>)}</div>}</section>
    </div>
  </div>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="admin-stat"><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>; }
export function AdminHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <header className="admin-page-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</header>; }
