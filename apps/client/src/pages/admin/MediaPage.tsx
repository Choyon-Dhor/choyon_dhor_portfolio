import { Copy, Edit3, ImagePlus, Link, Search, Trash2, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { api, mediaUrl } from '../../lib/api';
import type { MediaAsset } from '../../types';
import { AdminHeader } from './AdminDashboardPage';

interface MediaResponse { assets: MediaAsset[] }
const blank: MediaAsset = { url: '', altText: '', caption: '', description: '', category: '', credit: '', date: '', location: '', focalX: 50, focalY: 50 };

import { readFileAsDataUrl } from '../../lib/fileHelper';

export function MediaPage() {
  const client = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const { data } = useQuery({ queryKey: ['admin-media'], queryFn: async () => (await api.get<MediaResponse>('/admin/media')).data.assets });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!id || id === 'undefined') return;
      return api.delete(`/admin/media/${id}`);
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-media'] }); toast.success('Media deleted.'); },
    onError: (e) => toast.error(e.message)
  });

  const save = useMutation({
    mutationFn: async (asset: MediaAsset) => {
      const id = asset._id || asset.assetId || 'media-' + Date.now();
      return (await api.patch(`/admin/media/${id}`, asset)).data;
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-media'] }); setEditing(null); toast.success('Media updated.'); },
    onError: (e) => toast.error(e.message)
  });

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await readFileAsDataUrl(file);
        const payload = {
          _id: 'media-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          filename: file.name,
          originalName: file.name,
          url: dataUrl,
          thumbnailUrl: dataUrl,
          mimeType: file.type || 'image/jpeg',
          fileType: file.type.startsWith('video') ? 'video' : file.type.includes('pdf') ? 'pdf' : 'image',
          fileSize: file.size,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          caption: '',
          category: 'Uploads'
        };
        await api.post('/admin/media', payload);
      }
      client.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Media uploaded successfully.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const addByUrl = async () => {
    const url = prompt('Enter image URL (e.g. https://...):');
    if (!url || !url.trim()) return;
    try {
      const cleanUrl = url.trim();
      await api.post('/admin/media', {
        _id: 'media-' + Date.now(),
        filename: 'external-image.jpg',
        originalName: 'External Media',
        url: cleanUrl,
        thumbnailUrl: cleanUrl,
        mimeType: 'image/jpeg',
        fileType: 'image',
        altText: 'External media',
        category: 'General'
      });
      client.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Media URL added.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add URL');
    }
  };

  const categories = useMemo(() => ['all', ...Array.from(new Set((data || []).map((item) => item.category).filter(Boolean) as string[]))], [data]);
  const filtered = useMemo(() => (data || []).filter((item) => {
    const matchesSearch = !search || `${item.originalName || ''} ${item.caption || ''} ${item.altText || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  }), [category, data, search]);

  const copyUrl = (rawUrl?: string) => {
    if (!rawUrl) return;
    const resolved = rawUrl.startsWith('http') || rawUrl.startsWith('data:') ? rawUrl : `${window.location.origin}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;
    navigator.clipboard.writeText(resolved);
    toast.success('Media URL copied to clipboard.');
  };

  return <div className="admin-page">
    <AdminHeader
      eyebrow="MEDIA LIBRARY"
      title="Media"
      description="Upload images and files, edit metadata, or add external image URLs to use across your portfolio."
      action={
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="button" className="button secondary" onClick={addByUrl}><Link size={16} /> Add by URL</button>
          <label className="button primary upload-button">
            <ImagePlus size={17} /> {uploading ? 'Processing...' : 'Upload files'}
            <input type="file" multiple accept="image/*,video/*,.pdf" onChange={upload} disabled={uploading} />
          </label>
        </div>
      }
    />
    <div className="admin-toolbar">
      <div className="search-box">
        <Search size={16} />
        <input placeholder="Search media..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <select value={category} onChange={(event) => setCategory(event.target.value)}>
        {categories.map((item) => <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>)}
      </select>
    </div>
    <section className="media-grid">
      {filtered.map((file) => (
        <article className="media-card" key={file._id || file.url}>
          <div className="media-preview">
            {file.fileType === 'pdf' ? (
              <span>PDF</span>
            ) : file.fileType === 'video' ? (
              <video src={mediaUrl(file.url)} muted playsInline />
            ) : (
              <img
                src={mediaUrl(file.thumbnailUrl || file.url)}
                alt={file.altText || file.caption || file.originalName || ''}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder.jpg';
                }}
              />
            )}
          </div>
          <div>
            <strong>{file.originalName || file.filename}</strong>
            <small>{file.caption || file.category || `${((file.fileSize || 0) / 1024).toFixed(1)} KB`}</small>
            {!!file.usedBy?.length && <small className="media-usage">Used in {file.usedBy.join(', ')}</small>}
          </div>
          <div className="media-actions">
            <button title="Copy URL" onClick={() => copyUrl(file.url)}><Copy size={16} /></button>
            <button title="Edit Metadata" onClick={() => setEditing({ ...blank, ...file })}><Edit3 size={16} /></button>
            <button className="danger" title="Delete" onClick={() => confirm('Delete this media file?') && file._id && remove.mutate(file._id)} disabled={!!file.usedBy?.length}><Trash2 size={16} /></button>
          </div>
        </article>
      ))}
      {!filtered.length && <div className="admin-panel table-empty">No media uploaded yet.</div>}
    </section>
    {editing && <MediaEditor asset={editing} saving={save.isPending} onClose={() => setEditing(null)} onSave={(asset) => save.mutate(asset)} />}
  </div>;
}

function MediaEditor({ asset, saving, onClose, onSave }: { asset: MediaAsset; saving: boolean; onClose: () => void; onSave: (asset: MediaAsset) => void }) {
  const [form, setForm] = useState(asset);
  const set = (key: keyof MediaAsset, value: unknown) => setForm((current) => ({ ...current, [key]: value }));

  return <div className="admin-modal">
    <form className="editor-panel compact" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <div className="editor-header">
        <div>
          <span>MEDIA EDITOR</span>
          <h2>Edit media metadata</h2>
        </div>
        <button type="button" onClick={onClose}><X /></button>
      </div>
      <div className="editor-body form-grid">
        <label className="full">
          Image / Media URL
          <input value={form.url || ''} onChange={(event) => { set('url', event.target.value); set('thumbnailUrl', event.target.value); }} placeholder="https://... or data:image/..." />
        </label>
        <label className="full">
          Replace with new file
          <input
            type="file"
            accept="image/*,video/*,.pdf"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                const url = await readFileAsDataUrl(f);
                set('url', url);
                set('thumbnailUrl', url);
                set('filename', f.name);
                set('originalName', f.name);
                toast.success('Image replaced in form. Click "Save media" to update.');
              }
            }}
          />
        </label>
        <label className="full">Alt text<input value={form.altText || ''} onChange={(event) => set('altText', event.target.value)} /></label>
        <label className="full">Caption<input value={form.caption || ''} onChange={(event) => set('caption', event.target.value)} /></label>
        <label className="full">Description<textarea rows={4} value={form.description || ''} onChange={(event) => set('description', event.target.value)} /></label>
        <label>Category<input value={form.category || ''} onChange={(event) => set('category', event.target.value)} /></label>
        <label>Credit<input value={form.credit || ''} onChange={(event) => set('credit', event.target.value)} /></label>
        <label>Date<input value={form.date || ''} onChange={(event) => set('date', event.target.value)} /></label>
        <label>Location<input value={form.location || ''} onChange={(event) => set('location', event.target.value)} /></label>
        <label>Focal X<input type="number" min={0} max={100} value={form.focalX ?? 50} onChange={(event) => set('focalX', Number(event.target.value))} /></label>
        <label>Focal Y<input type="number" min={0} max={100} value={form.focalY ?? 50} onChange={(event) => set('focalY', Number(event.target.value))} /></label>
      </div>
      <div className="editor-footer">
        <button type="button" className="button" onClick={onClose}>Cancel</button>
        <button className="button primary" disabled={saving}>{saving ? 'Saving...' : 'Save media'}</button>
      </div>
    </form>
  </div>;
}
