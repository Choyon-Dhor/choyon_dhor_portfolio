import { ExternalLink, Radio } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { GlassCard } from '../../components/GlassCard';
import { PageHeader } from '../../components/PageHeader';
import { useSite } from '../../context/SiteContext';
import { api } from '../../lib/api';

export function ContactPage() {
  const { settings, page } = useSite();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const contactReasons = (settings.contactReasons || []).map((reason) => String(reason).trim()).filter(Boolean);
  const inquiryOptions = contactReasons.length ? contactReasons : ['General Message'];
  const socials = settings.socials
    .map((entry) => ({ label: String(entry.label || '').trim(), url: String(entry.url || '').trim() }))
    .filter((entry) => entry.label && entry.url);
  const contactLinks = socials.length
    ? socials
    : settings.email
      ? [{ label: settings.email, url: `mailto:${settings.email}` }]
      : [];

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      organization: String(form.get('organization') || '').trim(),
      inquiryType: String(form.get('inquiryType') || inquiryOptions[0] || 'General Message').trim() || 'General Message',
      subject: String(form.get('subject') || '').trim(),
      message: String(form.get('message') || '').trim(),
      website: String(form.get('website') || '')
    };

    try {
      await api.post('/public/contact', payload);
      setSent(true);
      event.currentTarget.reset();
      toast.success('Transmission received.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send message');
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageHeader page={page('contact')} fallbackTitle="Communication Portal" />
    <section className="container contact-layout section first-section">
      <GlassCard className="contact-console"><div className="contact-signal"><Radio /><span>OPEN CHANNEL</span></div><h2>Let's build something meaningful.</h2><p>Available for research collaboration, graduate opportunities, AI projects, workshops, speaking and community-focused initiatives.</p>
        <div className="contact-links">{contactLinks.map((entry) => <a href={entry.url} key={`${entry.label}-${entry.url}`} target="_blank" rel="noreferrer">{entry.label}<ExternalLink size={15} /></a>)}</div>
      </GlassCard>
      <GlassCard className="contact-form-card">{sent ? <div className="transmission-success"><span>TRANSMISSION SUCCESSFUL</span><h2>Your message entered the Nexus.</h2><button className="button" onClick={() => setSent(false)}>Send another</button></div> : <form onSubmit={submit} className="form-grid">
        <label>Name<input name="name" required minLength={2} /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Organization<input name="organization" /></label>
        <label>Inquiry type<select name="inquiryType" defaultValue={inquiryOptions[0]}>{inquiryOptions.map((reason) => <option key={reason}>{reason}</option>)}</select></label>
        <label className="full">Subject<input name="subject" required minLength={3} /></label>
        <label className="full">Message<textarea name="message" required minLength={10} rows={7} /></label>
        <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
        <button className="button primary full" disabled={loading}>{loading ? 'Transmitting...' : 'Send transmission'}</button>
      </form>}</GlassCard>
    </section>
  </>;
}
