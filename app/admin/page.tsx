"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { defaultContent, type SiteContent } from "../content";
import { getSupabase } from "@/lib/supabase";

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
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"info" | "error" | "success">("info");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = getSupabase();

  async function checkAdmin(account: User) {
    if (!supabase) return;
    setUser(account);
    const adminEmail = account.email?.trim().toLowerCase();
    if (!adminEmail) {
      setIsAdmin(false);
      setNotice("This Supabase account has no email address, so it cannot be allowlisted for admin access.");
      setNoticeKind("error");
      return;
    }
    const { data: adminRecord, error: adminError } = await supabase
      .from("site_admins").select("email").eq("email", adminEmail).maybeSingle();
    if (adminError) {
      setIsAdmin(false);
      setNotice(`Could not check admin access: ${adminError.message}`);
      setNoticeKind("error");
      return;
    }
    if (!adminRecord) {
      setIsAdmin(false);
      setNotice("This account is signed in but its email is not on the MOK admin allowlist.");
      setNoticeKind("info");
      return;
    }
    setIsAdmin(true);
    const { data, error } = await supabase.from("site_content").select("content").eq("id", "primary").single();
    if (error) {
      setNotice(`Could not load site content: ${error.message}`);
      setNoticeKind("error");
      return;
    }
    setForm({ ...defaultContent, ...(data.content as Partial<SiteContent>) });
    setNotice("");
  }

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    let active = true;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (!session) setIsAdmin(false);
    });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setNotice(error.message);
        setNoticeKind("error");
      } else if (data.session?.user) {
        void checkAdmin(data.session.user);
      }
      setReady(true);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  // `supabase` is memoized by getSupabase and remains stable for this page.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(key: keyof SiteContent, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setNotice("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setNotice(error.message);
      setNoticeKind("error");
      return;
    }
    setPassword("");
    if (data.user) await checkAdmin(data.user);
  }

  async function save() {
    if (!supabase || !isAdmin) return;
    setSaving(true);
    setSaved(false);
    const { error } = await supabase.from("site_content").update({ content: form, updated_at: new Date().toISOString() }).eq("id", "primary");
    setSaving(false);
    if (error) {
      setNotice(`Could not save changes: ${error.message}`);
      setNoticeKind("error");
      return;
    }
    setNotice("Changes saved. The public website will show the updated content.");
    setNoticeKind("success");
    setSaved(true);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setNotice("");
  }

  return <main className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="brand admin-brand"><span className="brand-mark">M<span>·</span></span><span className="brand-name">MOK<span>LIMITED</span></span></Link><div className="sidebar-label">WORKSPACE</div><a className="sidebar-item active" href="#overview"><span>◫</span> Site information</a><Link className="sidebar-item" href="/"><span>↗</span> View live preview</Link><div className="sidebar-bottom"><span className="avatar">M</span><span><b>{user?.email ?? "MOK Admin"}</b><small>{user ? "Signed in" : "Site manager"}</small></span><span className="online-dot"/></div></aside><section className="admin-main"><header className="admin-top"><div className="breadcrumbs"><Link href="/">Website</Link><span>/</span><b>Site information</b></div>{isAdmin ? <button className="preview-button" onClick={signOut}>Sign out</button> : <Link className="preview-button" href="/">View website <span>↗</span></Link>}</header><div className="admin-content" id="overview">
    {!ready ? <div className="admin-loading">Connecting to Supabase…</div> : !supabase ? <div className="admin-auth-wrap"><div className="admin-auth-card"><span className="admin-eyebrow">SUPABASE SETUP</span><h1>Connect your project</h1><p>Add your Supabase project URL and publishable key to <code>.env.local</code>, then restart the development server.</p><p className="auth-help">See <code>supabase/README.md</code> for setup steps. The website keeps using its preview content until the connection is configured.</p><Link className="preview-button" href="/">Back to website</Link></div></div> : !user ? <div className="admin-auth-wrap"><div className="admin-auth-card"><span className="admin-eyebrow">MOK WEBSITE ADMIN</span><h1>Sign in</h1><p>Use the admin account created in Supabase to manage the website.</p>{notice && <div className="admin-notice error-notice"><span>!</span><p>{notice}</p></div>}<form className="admin-auth-form" onSubmit={signIn}><label className="form-field"><span className="field-label">Email</span><input autoComplete="username" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className="form-field"><span className="field-label">Password</span><input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button className="save-button" type="submit">Sign in <span>→</span></button></form><Link className="auth-back" href="/">← Back to website</Link></div></div> : !isAdmin ? <div className="admin-auth-wrap"><div className="admin-auth-card"><span className="admin-eyebrow">ADMIN ACCESS</span><h1>Account not allowlisted</h1><p>{notice || "Your signed-in account does not have permission to edit this website."}</p><div className="user-id-box"><span>EMAIL USED TO SIGN IN</span><code>{user.email}</code></div><p className="auth-help">To grant access, add this exact email to <code>public.site_admins</code> using the SQL instructions in <code>supabase/schema.sql</code>.</p><button className="reset-button" onClick={signOut}>Sign out</button></div></div> : <><div className="admin-heading"><div><span className="admin-eyebrow">WEBSITE SETTINGS</span><h1>Site information</h1><p>Manage the details and messaging visitors see across your website.</p></div><span className="saved-status"><i/> Shared through Supabase</span></div>{notice && <div className={`admin-notice ${noticeKind === "error" ? "error-notice" : ""}`}><span>{noticeKind === "success" ? "✓" : noticeKind === "error" ? "!" : "✳"}</span><p>{notice}</p></div>}<div className="settings-card"><div className="settings-card-head"><div><h2>Company profile</h2><p>Keep your contact information and company story up to date.</p></div><span className="edit-glyph">✎</span></div><div className="field-grid">{fields.map(({ key, label, hint, multiline }) => <label className={`form-field ${multiline ? "field-wide" : ""}`} key={key}><span className="field-label">{label}</span>{multiline ? <textarea rows={key === "about" ? 4 : 3} value={form[key]} onChange={(event) => update(key, event.target.value)} /> : <input value={form[key]} onChange={(event) => update(key, event.target.value)} />}{hint && <span className="field-hint">{hint}</span>}</label>)}</div><div className="settings-actions"><button className="reset-button" onClick={() => { setForm(defaultContent); setSaved(false); }}>Restore defaults</button><div><span className={`save-feedback ${saved ? "visible" : ""}`}>✓ Saved to Supabase</span><button className="save-button" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save changes"} <span>→</span></button></div></div></div><div className="admin-footnote">Changes are shared with all website visitors <span>·</span> Supabase database</div></>}
    </div></section></main>;
}
