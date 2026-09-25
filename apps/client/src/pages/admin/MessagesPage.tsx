import { Archive, MailOpen, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import type { ContactMessage } from '../../types';
import { AdminHeader } from './AdminDashboardPage';

export function MessagesPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState('all');
  const { data } = useQuery({ queryKey: ['admin-messages', status], queryFn: async () => (await api.get<{ messages: ContactMessage[] }>('/admin/messages', { params: status === 'all' ? {} : { status } })).data.messages });
  const update = useMutation({ mutationFn: async ({ id, next }: { id: string; next: string }) => api.patch(`/admin/messages/${id}`, { status: next }), onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-messages'] }); client.invalidateQueries({ queryKey: ['admin-dashboard'] }); toast.success('Message updated.'); } });
  const remove = useMutation({ mutationFn: async (id: string) => api.delete(`/admin/messages/${id}`), onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-messages'] }); client.invalidateQueries({ queryKey: ['admin-dashboard'] }); toast.success('Message deleted.'); } });
  return <div className="admin-page"><AdminHeader eyebrow="COMMUNICATION INBOX" title="Messages" description="Review, mark as read, archive or remove portfolio contact transmissions." />
    <div className="admin-toolbar"><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All messages</option><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select></div>
    <div className="message-list">{data?.map((message) => <article className={`message-card ${message.status}`} key={message._id}><div className="message-card-head"><div><span className={`message-state ${message.status}`} /> <strong>{message.subject}</strong><small>{message.name} - <a href={`mailto:${message.email}`}>{message.email}</a> - {message.organization || 'Independent'} - {message.inquiryType || 'General Message'} - {new Date(message.createdAt).toLocaleString()}</small></div><div className="row-actions">{message.status === 'new' && <button title="Mark read" onClick={() => update.mutate({ id: message._id, next: 'read' })}><MailOpen size={17} /></button>}{message.status !== 'archived' && <button title="Archive" onClick={() => update.mutate({ id: message._id, next: 'archived' })}><Archive size={17} /></button>}<button className="danger" title="Delete" onClick={() => confirm('Delete this message?') && remove.mutate(message._id)}><Trash2 size={17} /></button></div></div><p>{message.message}</p></article>)}{!data?.length && <div className="admin-panel table-empty">No messages in this view.</div>}</div>
  </div>;
}
