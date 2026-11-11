"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contentKey, defaultContent, type SiteContent } from "../content";

const fields: { key: keyof SiteContent; label: string; hint: string; multiline?: boolean }[] = [
  { key: "company", label: "Company name", hint: "Shown in the browser title and brand." },
  { key: "tagline", label: "Brand descriptor", hint: "A short description beneath the company name." },
  { key: "headline", label: "Homepage headline", hint: "The main message visitors see first.", multiline: true },
  { key: "intro", label: "Homepage introduction", hint: "Supporting text below the main headline.", multiline: true },
  { key: "about", label: "About MOK", hint: "Your company overview.", multiline: true },
  { key: "vision", label: "Vision statement", hint: "Your long-term ambition.", multiline: true },
  { key: "mission", label: "Mission statement", hint: "The work you do to achieve your vision.", multiline: true },
  { key: "cta", label: "Contact call to action", hint: "The headline in the contact section." },
  { key: "email", label: "Contact email", hint: "Used for email links across the website." },
  { key: "phone", label: "Contact phone", hint: "Used for phone links across the website." },
  { key: "address", label: "Office address", hint: "Displayed in the contact section." },
  { key: "director", label: "Director name", hint: "Displayed in the contact section." },
  { key: "website", label: "Website address", hint: "Your public website domain." },
];

export default function AdminPage() {
  const [form, setForm] = useState<SiteContent>(defaultContent);
  const [saved, setSaved] = useState(false);
  useEffect(() => { const value = localStorage.getItem(contentKey); if (value) try { setForm({ ...defaultContent, ...JSON.parse(value) }); } catch { /* Keep defaults. */ } }, []);
  function update(key: keyof SiteContent, value: string) { setForm((current) => ({ ...current, [key]: value })); setSaved(false); }
  function save() { localStorage.setItem(contentKey, JSON.stringify(form)); setSaved(true); }
  function reset() { setForm(defaultContent); localStorage.removeItem(contentKey); setSaved(false); }

  return <main className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="brand admin-brand"><span className="brand-mark">M<span>·</span></span><span className="brand-name">MOK<span>LIMITED</span></span></Link><div className="sidebar-label">WORKSPACE</div><a className="sidebar-item active" href="#overview"><span>◫</span> Site information</a><Link className="sidebar-item" href="/"><span>↗</span> View live preview</Link><div className="sidebar-bottom"><span className="avatar">M</span><span><b>MOK Admin</b><small>Site manager</small></span><span className="online-dot"/></div></aside><section className="admin-main"><header className="admin-top"><div className="breadcrumbs"><Link href="/">Website</Link><span>/</span><b>Site information</b></div><Link className="preview-button" href="/">View website <span>↗</span></Link></header><div className="admin-content" id="overview"><div className="admin-heading"><div><span className="admin-eyebrow">WEBSITE SETTINGS</span><h1>Site information</h1><p>Manage the details and messaging visitors see across your website.</p></div><span className="saved-status"><i/> Changes save in this browser</span></div><div className="admin-notice"><span>✳</span><p><b>Prototype admin</b><br/>These settings are stored in this browser for the prototype. A live site will need secure sign-in and a shared database.</p></div><div className="settings-card"><div className="settings-card-head"><div><h2>Company profile</h2><p>Keep your contact information and company story up to date.</p></div><span className="edit-glyph">✎</span></div><div className="field-grid">{fields.map(({ key, label, hint, multiline }) => <label className={`form-field ${multiline ? "field-wide" : ""}`} key={key}><span className="field-label">{label}</span>{multiline ? <textarea rows={key === "about" ? 4 : 3} value={form[key]} onChange={(e) => update(key, e.target.value)} /> : <input value={form[key]} onChange={(e) => update(key, e.target.value)} />}{hint && <span className="field-hint">{hint}</span>}</label>)}</div><div className="settings-actions"><button className="reset-button" onClick={reset}>Reset to original</button><div><span className={`save-feedback ${saved ? "visible" : ""}`}>✓ Saved — visible on the website</span><button className="save-button" onClick={save}>Save changes <span>→</span></button></div></div></div><div className="admin-footnote">Your website content <span>·</span> Updated moments ago</div></div></section></main>;
}
