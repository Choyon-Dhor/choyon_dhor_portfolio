import { Edit3, Plus, Trash2, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import type { PageData } from '../../types';
import { AdminHeader } from './AdminDashboardPage';

const blank: Partial<PageData> = { slug: '', title: '', eyebrow: '', subtitle: '', intro: '', seoTitle: '', seoDescription: '', visible: true, order: 0, sections: [] };
export function PagesManagerPage() {
  const client = useQueryClient(); const [editing, setEditing] = useState<Partial<PageData> | null>(null);
  const { data } = useQuery({ queryKey: ['admin-pages'], queryFn: async () => (await api.get<{ pages: PageData[] }>('/admin/pages')).data.pages });
  const save = useMutation({
    mutationFn: async (page: Partial<PageData>) => {
      const id = page._id || page.slug;
      return id ? api.put(`/admin/pages/${id}`, page) : api.post('/admin/pages', page);
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-pages'] }); client.invalidateQueries({ queryKey: ['bootstrap'] }); setEditing(null); toast.success('Page saved.'); },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!id || id === 'undefined') return;
      return api.delete(`/admin/pages/${id}`);
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-pages'] }); client.invalidateQueries({ queryKey: ['bootstrap'] }); toast.success('Page deleted.'); }
  });
  return <div className="admin-page"><AdminHeader eyebrow="PAGE CONTROL" title="Pages" description="Edit page headings, introductions, visibility, SEO and custom section data." action={<button className="button primary" onClick={() => setEditing({ ...blank })}><Plus size={17} /> New page</button>} />
    <section className="admin-panel table-panel"><div className="admin-table"><div className="table-head pages"><span>Page</span><span>Slug</span><span>Visibility</span><span>Order</span><span>Actions</span></div>{data?.map((page) => <div className="table-row pages" key={page._id || page.slug}><div><strong>{page.title}</strong><small>{page.eyebrow}</small></div><code>/{page.slug}</code><span>{page.visible ? 'Visible' : 'Hidden'}</span><span>{page.order}</span><div className="row-actions"><button onClick={() => setEditing(page)}><Edit3 size={16} /></button><button className="danger" onClick={() => { const id = page._id || page.slug; if (id && confirm(`Delete page “${page.title}”?`)) remove.mutate(id); }}><Trash2 size={16} /></button></div></div>)}</div></section>
    {editing && <PageEditor value={editing} saving={save.isPending} onClose={() => setEditing(null)} onSave={(page) => save.mutate(page)} />}
  </div>;
}
function PageEditor({ value, saving, onClose, onSave }: { value: Partial<PageData>; saving: boolean; onClose: () => void; onSave: (value: Partial<PageData>) => void }) {
  const [form, setForm] = useState(value); const set = (key: keyof PageData, value: unknown) => setForm((old) => ({ ...old, [key]: value }));
  return <div className="admin-modal"><form className="editor-panel compact" onSubmit={(e) => { e.preventDefault(); onSave(form); }}><div className="editor-header"><div><span>PAGE EDITOR</span><h2>{form._id ? 'Edit page' : 'Create page'}</h2></div><button type="button" onClick={onClose}><X /></button></div><div className="editor-body form-grid">
    <label>Title<input required value={form.title || ''} onChange={(e) => set('title', e.target.value)} /></label><label>Slug<input required pattern="[a-z0-9-]+" value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} /></label><label>Eyebrow<input value={form.eyebrow || ''} onChange={(e) => set('eyebrow', e.target.value)} /></label><label>Order<input type="number" value={form.order || 0} onChange={(e) => set('order', Number(e.target.value))} /></label><label className="full">Subtitle<input value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} /></label><label className="full">Introduction<textarea rows={4} value={form.intro || ''} onChange={(e) => set('intro', e.target.value)} /></label><label className="full">SEO title<input value={form.seoTitle || ''} onChange={(e) => set('seoTitle', e.target.value)} /></label><label className="full">SEO description<textarea rows={3} value={form.seoDescription || ''} onChange={(e) => set('seoDescription', e.target.value)} /></label><label className="full">Custom sections JSON<textarea rows={6} defaultValue={JSON.stringify(form.sections || [], null, 2)} onBlur={(e) => { try { set('sections', JSON.parse(e.target.value)); } catch { toast.error('Sections JSON is invalid.'); } }} /></label><label className="check-label"><input type="checkbox" checked={form.visible ?? true} onChange={(e) => set('visible', e.target.checked)} /> Visible</label>
  </div><div className="editor-footer"><button type="button" className="button" onClick={onClose}>Cancel</button><button className="button primary" disabled={saving}>{saving ? 'Saving...' : 'Save page'}</button></div></form></div>;
}
