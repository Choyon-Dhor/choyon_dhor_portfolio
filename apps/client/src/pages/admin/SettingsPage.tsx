import { Save } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import type { SiteSettings } from '../../types';
import { AdminHeader } from './AdminDashboardPage';

export function SettingsPage() {
  const client = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-settings'], queryFn: async () => (await api.get<{ settings: SiteSettings }>('/admin/settings')).data.settings });
  const [form, setForm] = useState<SiteSettings | null>(null);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: async (value: SiteSettings) => api.put('/admin/settings', value),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['admin-settings'] });
      client.invalidateQueries({ queryKey: ['bootstrap'] });
      toast.success('Site settings updated.');
    },
    onError: (error) => toast.error(error.message)
  });

  if (!form) return <div className="admin-page"><AdminHeader eyebrow="SYSTEM CONFIG" title="Site settings" description="Loading configuration..." /></div>;
  const set = (key: keyof SiteSettings, value: unknown) => setForm((old) => old ? ({ ...old, [key]: value }) : old);
  const parseJsonField = (key: keyof SiteSettings, raw: string, fallback: unknown) => {
    try { set(key, raw.trim() ? JSON.parse(raw) : fallback); }
    catch { toast.error('Invalid JSON for this field.'); }
  };

  return <div className="admin-page"><AdminHeader eyebrow="SYSTEM CONFIG" title="Site settings" description="Control hero identity, portrait system, about story, live status, social links and SEO." action={<button className="button primary" onClick={() => save.mutate(form)} disabled={save.isPending}><Save size={17} /> {save.isPending ? 'Saving...' : 'Save settings'}</button>} />
    <section className="admin-panel settings-panel"><div className="form-grid">
      <label>Site name<input value={form.siteName} onChange={(e) => set('siteName', e.target.value)} /></label>
      <label>Tagline<input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} /></label>
      <label>Hero name<input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} /></label>
      <label>Hero subtitle<input value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)} /></label>
      <label className="full">Hero secondary title<input value={form.heroSecondaryTitle} onChange={(e) => set('heroSecondaryTitle', e.target.value)} /></label>
      <label className="full">Hero description<textarea rows={4} value={form.heroDescription} onChange={(e) => set('heroDescription', e.target.value)} /></label>
      <label className="full">Current focus<input value={form.currentFocus} onChange={(e) => set('currentFocus', e.target.value)} /></label>
      <label className="full">Availability status<input value={form.availabilityStatus} onChange={(e) => set('availabilityStatus', e.target.value)} /></label>
      <label>Location<input value={form.location} onChange={(e) => set('location', e.target.value)} /></label>
      <label>Email<input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
      <label className="full">Availability text<input value={form.availability} onChange={(e) => set('availability', e.target.value)} /></label>
      <label>Primary portrait URL<input value={form.profileImage} onChange={(e) => set('profileImage', e.target.value)} /></label>
      <label>Primary portrait alt text<input value={form.profileImageAlt} onChange={(e) => set('profileImageAlt', e.target.value)} /></label>
      <label className="full">Primary portrait caption<input value={form.profileImageCaption} onChange={(e) => set('profileImageCaption', e.target.value)} /></label>
      <label>Portrait focal X<input type="number" min={0} max={100} value={form.profileImageFocalX} onChange={(e) => set('profileImageFocalX', Number(e.target.value))} /></label>
      <label>Portrait focal Y<input type="number" min={0} max={100} value={form.profileImageFocalY} onChange={(e) => set('profileImageFocalY', Number(e.target.value))} /></label>
      <label>Alternate portrait URL<input value={form.alternateProfileImage} onChange={(e) => set('alternateProfileImage', e.target.value)} /></label>
      <label>Alternate portrait alt<input value={form.alternateProfileImageAlt} onChange={(e) => set('alternateProfileImageAlt', e.target.value)} /></label>
      <label>Transparent portrait URL<input value={form.transparentProfileImage} onChange={(e) => set('transparentProfileImage', e.target.value)} /></label>
      <label>Transparent portrait alt<input value={form.transparentProfileImageAlt} onChange={(e) => set('transparentProfileImageAlt', e.target.value)} /></label>
      <label>Resume URL<input placeholder="/uploads/resume.pdf or https://..." value={form.resumeUrl} onChange={(e) => set('resumeUrl', e.target.value)} /><small>Optional. If this is empty, the hero button will show a CV request email link instead of opening a file.</small></label>
      <label>Hero primary CTA label<input value={form.heroPrimaryCtaLabel} onChange={(e) => set('heroPrimaryCtaLabel', e.target.value)} /></label>
      <label>Hero primary CTA URL<input value={form.heroPrimaryCtaUrl} onChange={(e) => set('heroPrimaryCtaUrl', e.target.value)} /></label>
      <label>Hero secondary CTA label<input value={form.heroSecondaryCtaLabel} onChange={(e) => set('heroSecondaryCtaLabel', e.target.value)} /></label>
      <label>Hero secondary CTA URL<input value={form.heroSecondaryCtaUrl} onChange={(e) => set('heroSecondaryCtaUrl', e.target.value)} /></label>
      <label className="full">Hero orbit labels JSON<textarea rows={5} value={JSON.stringify(form.heroOrbitLabels, null, 2)} onChange={(e) => parseJsonField('heroOrbitLabels', e.target.value, [])} /></label>
      <label className="full">Terminal greeting<textarea rows={3} value={form.terminalGreeting} onChange={(e) => set('terminalGreeting', e.target.value)} /></label>
      <label className="full">About title<input value={form.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} /></label>
      <label className="full">About story<textarea rows={5} value={form.aboutStory} onChange={(e) => set('aboutStory', e.target.value)} /></label>
      <label className="full">Academic background<textarea rows={4} value={form.academicBackground} onChange={(e) => set('academicBackground', e.target.value)} /></label>
      <label className="full">Research motivation<textarea rows={4} value={form.researchMotivation} onChange={(e) => set('researchMotivation', e.target.value)} /></label>
      <label className="full">Development interests<textarea rows={4} value={form.developmentInterests} onChange={(e) => set('developmentInterests', e.target.value)} /></label>
      <label className="full">Leadership philosophy<textarea rows={4} value={form.leadershipPhilosophy} onChange={(e) => set('leadershipPhilosophy', e.target.value)} /></label>
      <label className="full">Community vision<textarea rows={4} value={form.communityVision} onChange={(e) => set('communityVision', e.target.value)} /></label>
      <label className="full">Personal goals<textarea rows={4} value={form.personalGoals} onChange={(e) => set('personalGoals', e.target.value)} /></label>
      <label className="full">About gallery JSON<textarea rows={7} value={JSON.stringify(form.aboutGallery, null, 2)} onChange={(e) => parseJsonField('aboutGallery', e.target.value, [])} /></label>
      <label className="full">About milestones JSON<textarea rows={7} value={JSON.stringify(form.aboutMilestones, null, 2)} onChange={(e) => parseJsonField('aboutMilestones', e.target.value, [])} /></label>
      <label className="full">Statistics JSON<textarea rows={7} value={JSON.stringify(form.stats, null, 2)} onChange={(e) => parseJsonField('stats', e.target.value, [])} /></label>
      <label className="full">Social links JSON<textarea rows={7} value={JSON.stringify(form.socials, null, 2)} onChange={(e) => parseJsonField('socials', e.target.value, [])} /></label>
      <label className="full">Contact reasons JSON<textarea rows={5} value={JSON.stringify(form.contactReasons, null, 2)} onChange={(e) => parseJsonField('contactReasons', e.target.value, [])} /></label>
      <label className="full">Live status JSON<textarea rows={7} value={JSON.stringify(form.liveStatus, null, 2)} onChange={(e) => parseJsonField('liveStatus', e.target.value, {})} /></label>
      <label>Accent color<input type="color" value={form.accent} onChange={(e) => set('accent', e.target.value)} /></label>
      <label>Secondary accent<input type="color" value={form.secondaryAccent} onChange={(e) => set('secondaryAccent', e.target.value)} /></label>
      <label className="full">Footer text<input value={form.footerText} onChange={(e) => set('footerText', e.target.value)} /></label>
      <label className="full">SEO title<input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} /></label>
      <label className="full">SEO description<textarea rows={3} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} /></label>
    </div></section>
  </div>;
}

