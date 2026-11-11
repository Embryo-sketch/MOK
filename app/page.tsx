"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultContent, type SiteContent } from "./content";
import { getSupabase } from "@/lib/supabase";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let active = true;
    void supabase.from("site_content").select("content").eq("id", "primary").single().then(({ data }) => {
      if (active && data?.content) setContent({ ...defaultContent, ...(data.content as Partial<SiteContent>) });
    });
    return () => { active = false; };
  }, []);

  return <main>
    <header className="site-nav"><Link href="#home" className="brand" aria-label="MOK Limited home"><span className="brand-mark">M<span>·</span></span><span className="brand-name">MOK<span>LIMITED</span></span></Link><nav><a href="#approach">Our approach</a><a href="#venture">First venture</a><a href="#about">About us</a><a className="nav-contact" href="#contact">Start a conversation <Arrow diagonal /></a></nav><a className="mobile-cta" href="#contact">Get in touch <Arrow diagonal /></a></header>

    <section className="hero" id="home"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" />Lagos, Nigeria <span className="eyebrow-sep">/</span> Built for what’s next</div><h1>{content.headline}</h1><p className="hero-intro">{content.intro}</p><div className="hero-actions"><a className="button button-dark" href="#approach">Explore what we do <Arrow /></a><a className="text-link" href="#about">Meet MOK <Arrow diagonal /></a></div><div className="hero-proof"><span className="proof-line" /><span>Purpose-led. Commercially grounded.</span></div></div>
      <div className="hero-art" aria-label="Abstract green landscape illustration"><div className="art-top"><span className="art-label">01 — A different kind of growth</span><span className="art-coordinates">06°27′N<br/>03°24′E</span></div><div className="sun" /><div className="land land-back"/><div className="land land-mid"/><div className="land land-front"/><div className="art-bottom"><span className="art-caption">Progress, with purpose.</span><span className="art-index">MOK / 2026</span></div><span className="art-stem"/><span className="art-leaf leaf-one"/><span className="art-leaf leaf-two"/><span className="art-leaf leaf-three"/></div>
      <span className="hero-index">01 / 04</span></section>

    <section className="intro-band" id="about"><div className="section-kicker"><span>01</span><span>Who we are</span></div><div className="intro-content"><h2>We see the potential<br/>in a more sustainable <em>future.</em></h2><div className="intro-right"><p>{content.about}</p><a className="under-link" href="#principles">Get to know our thinking <Arrow /></a></div></div></section>

    <section className="approach" id="approach"><div className="approach-head"><div><div className="section-kicker light"><span>02</span><span>What we do</span></div><h2>From promising idea<br/>to lasting <em>enterprise.</em></h2></div><p>We bring the clarity, capability and capital that help sustainable businesses take root — then grow with intention.</p></div><div className="steps"><article className="step"><span className="step-no">01 <span>— NOW</span></span><div><h3>Create</h3><p>We design, launch and operate environmental ventures, starting with premium electric mobility in Lagos and Abuja.</p></div><span className="step-mark">↗</span></article><article className="step"><span className="step-no">02 <span>— NOW</span></span><div><h3>Invest</h3><p>We build thoughtful portfolios and connect sustainable businesses with long-term investment partners.</p></div><span className="step-mark">↗</span></article><article className="step"><span className="step-no">03 <span>— NEXT</span></span><div><h3>Scale</h3><p>We will help ambitious ventures combine their strengths and reach new markets through strategic growth.</p></div><span className="step-mark">↗</span></article></div></section>

    <section className="venture" id="venture"><div className="venture-visual"><div className="venture-visual-top"><span>THE FIRST MOVE</span><span>03 / 04</span></div><div className="road road-one"/><div className="road road-two"/><div className="car-scene"><div className="car-glow"/><div className="car"><span className="car-window"/><span className="car-wheel wheel-one"/><span className="car-wheel wheel-two"/></div><span className="charge-line"/><span className="charge-dot"/></div><div className="venture-visual-bottom"><span>Quietly changing the way<br/>business gets around.</span><span className="venture-stamp">EV<br/>LAGOS</span></div></div><div className="venture-copy"><div className="section-kicker"><span>03</span><span>Our first venture</span></div><span className="status-tag"><i/> In development</span><h2>A better way<br/>to <em>move.</em></h2><p>Premium electric cars, ready where business travellers arrive. A simple, self-drive experience designed around the way people actually travel.</p><ul className="venture-list"><li><span>01</span>Day-by-day electric car hire</li><li><span>02</span>Convenient airport and hotel hubs</li><li><span>03</span>Lagos first, then Abuja</li></ul><a className="button button-outline" href="#contact">Discuss the venture <Arrow diagonal /></a></div></section>

    <section className="principles" id="principles"><div className="principle-title"><div className="section-kicker"><span>04</span><span>Our point of view</span></div><h2>Good business<br/>should do <em>good.</em></h2><p>We are building a company around a simple belief: lasting commercial value and environmental progress belong in the same conversation.</p></div><div className="principle-cards"><article><span className="principle-icon">✳</span><h3>Integrity, always.</h3><p>Clear terms, honest reporting and the discipline to do what we say.</p></article><article><span className="principle-icon">⌁</span><h3>Built to endure.</h3><p>We favour resilient ventures with a lighter footprint and long-term relevance.</p></article><article><span className="principle-icon">↗</span><h3>Better together.</h3><p>We work alongside founders, investors and partners to make progress possible.</p></article></div></section>

    <section className="quote-band"><span className="quote-mark">“</span><blockquote>{content.vision}</blockquote><span className="quote-attribution">OUR VISION <span>—</span> MOK LIMITED</span></section>

    <section className="contact" id="contact"><div className="contact-main"><div className="section-kicker light"><span>05</span><span>Contact</span></div><h2>{content.cta}<br/><em>with purpose.</em></h2><p>Have a venture, an investment idea or a shared ambition? We’d like to hear from you.</p><a href={`mailto:${content.email}`} className="button button-light">Start a conversation <Arrow diagonal /></a></div><div className="contact-details"><div className="contact-detail"><span>EMAIL</span><a href={`mailto:${content.email}`}>{content.email}<Arrow diagonal /></a></div><div className="contact-detail"><span>PHONE</span><a href={`tel:${content.phone.replace(/[^+\d]/g, "")}`}>{content.phone}<Arrow diagonal /></a></div><div className="contact-detail"><span>OFFICE</span><p>{content.address}</p></div><div className="contact-detail"><span>DIRECTOR</span><p>{content.director}</p></div></div></section>

    <footer className="footer"><Link href="#home" className="brand footer-brand"><span className="brand-mark">M<span>·</span></span><span className="brand-name">MOK<span>LIMITED</span></span></Link><p>Thoughtfully building what comes next.</p><span className="footer-copy">© 2026 MOK Limited <span>·</span> RC 9960265</span><Link className="admin-link" href="/admin">Admin access <Arrow diagonal /></Link></footer>
  </main>;
}
