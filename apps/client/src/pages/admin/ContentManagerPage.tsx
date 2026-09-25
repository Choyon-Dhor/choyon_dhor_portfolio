import { Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import type { ContentItem, ContentType } from '../../types';
import { AdminHeader } from './AdminDashboardPage';

const types: ContentType[] = ['research', 'project', 'publication', 'experience', 'activity', 'event', 'achievement', 'skill', 'education', 'blog', 'timeline'];
const statusPresets = ['Idea', 'Planning', 'Literature Review', 'Data Collection', 'Experimentation', 'Writing', 'Submitted', 'Under Review', 'Revision', 'Conference Presented', 'Accepted', 'Published', 'Paused', 'Completed', 'In Development', 'Prototype', 'Functional', 'Active'];
const blank: Omit<ContentItem, '_id'> = { type: 'project', title: '', shortTitle: '', slug: '', eyebrow: '', summary: '', content: '', category: 'General', status: 'Planning', organization: '', location: '', featured: false, visible: true, order: 0, tags: [], technologies: [], metrics: [], links: [], coverImage: '', coverImageAlt: '', coverImageCaption: '', gallery: [], galleryItems: [], relatedContentIds: [], seoTitle: '', seoDescription: '', metadata: {} };

export function ContentManagerPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | ContentType>('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<ContentItem> | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['admin-content'], queryFn: async () => (await api.get<{ items: ContentItem[] }>('/admin/content')).data.items });
  const save = useMutation({
    mutationFn: async (item: Partial<ContentItem>) => item._id ? (await api.put(`/admin/content/${item._id}`, item)).data : (await api.post('/admin/content', item)).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-content'] }); queryClient.invalidateQueries({ queryKey: ['bootstrap'] }); setEditing(null); toast.success('Content saved.'); },
    onError: (error) => toast.error(error.message)
  });
  const remove = useMutation({ mutationFn: async (id: string) => api.delete(`/admin/content/${id}`), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-content'] }); queryClient.invalidateQueries({ queryKey: ['bootstrap'] }); toast.success('Content deleted.'); }, onError: (error) => toast.error(error.message) });
  const items = useMemo(() => (data || []).filter((item) => (filter === 'all' || item.type === filter) && `${item.title} ${item.shortTitle || ''} ${item.category} ${item.organization}`.toLowerCase().includes(search.toLowerCase())), [data, filter, search]);

  return <div className="admin-page"><AdminHeader eyebrow="CONTENT ENGINE" title="Portfolio content" description="Create, edit, feature or remove research, projects, activities, events and other portfolio entities." action={<button className="button primary" onClick={() => setEditing({ ...blank })}><Plus size={17} /> New record</button>} />
    <div className="admin-toolbar"><div className="search-box"><Search size={16} /><input placeholder="Search content..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><select value={filter} onChange={(event) => setFilter(event.target.value as 'all' | ContentType)}><option value="all">All types</option>{types.map((type) => <option key={type}>{type}</option>)}</select></div>
    <section className="admin-panel table-panel"><div className="admin-table"><div className="table-head"><span>Title</span><span>Type</span><span>Status</span><span>Visibility</span><span>Actions</span></div>{isLoading ? <p className="table-empty">Loading records...</p> : items.map((item) => <div className="table-row" key={item._id}><div><strong>{item.title}</strong><small>{item.category}{item.organization ? ` - ${item.organization}` : ''}</small></div><span className="type-badge">{item.type}</span><span>{item.status}</span><span>{item.visible ? 'Visible' : 'Hidden'}{item.featured ? ' - Featured' : ''}</span><div className="row-actions"><button onClick={() => setEditing(item)}><Edit3 size={16} /></button><button className="danger" onClick={() => confirm(`Delete "${item.title}"?`) && remove.mutate(item._id)}><Trash2 size={16} /></button></div></div>)}{!isLoading && !items.length && <p className="table-empty">No matching records.</p>}</div></section>
    {editing && <ContentEditor value={editing} allItems={data || []} onClose={() => setEditing(null)} onSave={(value) => save.mutate(value)} saving={save.isPending} />}
  </div>;
}

function ContentEditor({ value, allItems, onClose, onSave, saving }: { value: Partial<ContentItem>; allItems: ContentItem[]; onClose: () => void; onSave: (value: Partial<ContentItem>) => void; saving: boolean }) {
  const [form, setForm] = useState(value);
  const [relationSearch, setRelationSearch] = useState('');

  const field = (name: keyof ContentItem, next: unknown) => setForm((current) => ({ ...current, [name]: next }));
  const json = (name: keyof ContentItem, raw: string, fallback: unknown) => { try { field(name, raw.trim() ? JSON.parse(raw) : fallback); } catch { toast.error('Invalid JSON in editor.'); } };
  const autoSlug = (title: string) => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const selectedRelations = form.relatedContentIds || [];
  const relationOptions = useMemo(
    () => allItems
      .filter((item) => item._id !== form._id)
      .filter((item) => `${item.title} ${item.type} ${item.category || ''} ${item.organization || ''}`.toLowerCase().includes(relationSearch.toLowerCase()))
      .sort((left, right) => left.title.localeCompare(right.title)),
    [allItems, form._id, relationSearch]
  );

  const toggleRelation = (id: string) => {
    field('relatedContentIds', selectedRelations.includes(id) ? selectedRelations.filter((entry) => entry !== id) : [...selectedRelations, id]);
  };

  const submit = (event: React.FormEvent) => { event.preventDefault(); onSave(form); };
  return <div className="admin-modal"><form className="editor-panel" onSubmit={submit}><div className="editor-header"><div><span>CONTENT EDITOR</span><h2>{form._id ? 'Edit record' : 'Create record'}</h2></div><button type="button" onClick={onClose}><X /></button></div><div className="editor-body form-grid">
    <label>Content type<select value={form.type || 'project'} onChange={(e) => field('type', e.target.value)}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
    <label>Title<input required value={form.title || ''} onChange={(e) => { field('title', e.target.value); if (!form._id) field('slug', autoSlug(e.target.value)); }} /></label>
    <label>Short title<input value={form.shortTitle || ''} onChange={(e) => field('shortTitle', e.target.value)} /></label>
    <label>Slug<input required pattern="[a-z0-9-]+" value={form.slug || ''} onChange={(e) => field('slug', e.target.value)} /></label>
    <label>Eyebrow<input value={form.eyebrow || ''} onChange={(e) => field('eyebrow', e.target.value)} /></label>
    <label>Category<input value={form.category || ''} onChange={(e) => field('category', e.target.value)} /></label>
    <label>Status<input list="status-options" value={form.status || ''} onChange={(e) => field('status', e.target.value)} /></label>
    <label>Organization<input value={form.organization || ''} onChange={(e) => field('organization', e.target.value)} /></label>
    <label>Location<input value={form.location || ''} onChange={(e) => field('location', e.target.value)} /></label>
    <label>Start date<input type="date" value={form.startDate?.slice(0, 10) || ''} onChange={(e) => field('startDate', e.target.value)} /></label>
    <label>End date<input type="date" value={form.endDate?.slice(0, 10) || ''} onChange={(e) => field('endDate', e.target.value)} /></label>
    <label>Published date<input type="date" value={form.publishedAt?.slice(0, 10) || ''} onChange={(e) => field('publishedAt', e.target.value)} /></label>
    <label>Sort order<input type="number" value={form.order || 0} onChange={(e) => field('order', Number(e.target.value))} /></label>
    <label className="full">Summary<textarea rows={3} value={form.summary || ''} onChange={(e) => field('summary', e.target.value)} /></label>
    <label className="full">Full content (Markdown)<textarea rows={10} value={form.content || ''} onChange={(e) => field('content', e.target.value)} /></label>
    <label>Tags (comma separated)<input value={form.tags?.join(', ') || ''} onChange={(e) => field('tags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} /></label>
    <label>Technologies (comma separated)<input value={form.technologies?.join(', ') || ''} onChange={(e) => field('technologies', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} /></label>
    <label className="full">Cover image URL<input value={form.coverImage || ''} onChange={(e) => field('coverImage', e.target.value)} placeholder="/uploads/file.webp or https://..." /></label>
    <label>Cover image alt text<input value={form.coverImageAlt || ''} onChange={(e) => field('coverImageAlt', e.target.value)} /></label>
    <label>Cover image caption<input value={form.coverImageCaption || ''} onChange={(e) => field('coverImageCaption', e.target.value)} /></label>
    <label className="full">SEO title<input value={form.seoTitle || ''} onChange={(e) => field('seoTitle', e.target.value)} /></label>
    <label className="full">SEO description<textarea rows={3} value={form.seoDescription || ''} onChange={(e) => field('seoDescription', e.target.value)} /></label>
    <label className="full">Metrics JSON<textarea rows={4} value={JSON.stringify(form.metrics || [], null, 2)} onChange={(e) => json('metrics', e.target.value, [])} /></label>
    <label className="full">Links JSON<textarea rows={4} value={JSON.stringify(form.links || [], null, 2)} onChange={(e) => json('links', e.target.value, [])} /></label>
    <label className="full">Legacy gallery URL array JSON<textarea rows={4} value={JSON.stringify(form.gallery || [], null, 2)} onChange={(e) => json('gallery', e.target.value, [])} /></label>
    <label className="full">Gallery items JSON<textarea rows={6} value={JSON.stringify(form.galleryItems || [], null, 2)} onChange={(e) => json('galleryItems', e.target.value, [])} /></label>
    <div className="full relation-picker"><div className="relation-picker__header"><strong>Related records</strong><span>Select linked research, leadership, activity, event or publication modules.</span></div><div className="relation-picker__search search-box"><Search size={16} /><input placeholder="Search related content..." value={relationSearch} onChange={(event) => setRelationSearch(event.target.value)} /></div><div className="relation-picker__list">{relationOptions.map((item) => <label className="relation-option" key={item._id}><input type="checkbox" checked={selectedRelations.includes(item._id)} onChange={() => toggleRelation(item._id)} /><div><strong>{item.title}</strong><small>{item.type} • {item.category || 'General'}{item.organization ? ` • ${item.organization}` : ''}</small></div></label>)}{!relationOptions.length && <p className="relation-empty">No related content matches the current search.</p>}</div></div>
    <label className="full">Metadata JSON<textarea rows={7} value={JSON.stringify(form.metadata || {}, null, 2)} onChange={(e) => json('metadata', e.target.value, {})} /></label>
    <label className="check-label"><input type="checkbox" checked={form.visible ?? true} onChange={(e) => field('visible', e.target.checked)} /> Visible</label><label className="check-label"><input type="checkbox" checked={form.featured ?? false} onChange={(e) => field('featured', e.target.checked)} /> Featured</label>
    <datalist id="status-options">{statusPresets.map((status) => <option key={status} value={status} />)}</datalist>
  </div><div className="editor-footer"><button type="button" className="button" onClick={onClose}>Cancel</button><button className="button primary" disabled={saving}>{saving ? 'Saving...' : 'Save record'}</button></div></form></div>;
}
