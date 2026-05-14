"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PRO_PRICE_JPY } from "@/config/plans";
import "@/app/lp.css";

const MARQUEE_ITEMS: [string, string][] = [
  ["エントリーシート", "23:59"],
  ["説明会", "5月14日"],
  ["面接", "一次／二次／最終"],
  ["本日締切", "TODAY"],
  ["72時間前", "NOTIFY"],
  ["寝落ち、なし", "NEVER MISS"],
];

const FREE_LIST = [
  "締切アイテム10件まで",
  "締切24時間前のメール通知",
  "4階調の緊急度 × 4種類の選考タグ",
  "ステータス管理",
  "マジックリンク認証（パスワード不要）",
];

const PRO_LIST = [
  "締切アイテム 無制限",
  "締切 72 / 24 / 3時間前の通知",
  "4階調の緊急度 × 4種類の選考タグ",
  "FREE の全機能",
];

const URG_CARDS = [
  { cls: "overdue", off: 0,   label: "● Overdue ／ 期限切れ", title: "取り逃した。",  desc: "過ぎた時間はゼロにできない。だから〆トラは、過ぎる前に止める設計。", n: "−02h", u: "過ぎた" },
  { cls: "today",   off: 32,  label: "● Today ／ 当日",       title: "今日が、勝負。", desc: "濃いオレンジで、視界の中心に。寝落ちする前に、確実に呼び戻す。",     n: "07h",  u: "あと" },
  { cls: "soon",    off: 160, label: "● Soon ／ 3日以内",     title: "視界の端へ。",  desc: "準備期間。落ち着いた黄色で、近づいていることだけを知らせる。",       n: "2d",   u: "あと" },
  { cls: "normal",  off: 260, label: "● Normal ／ 通常",      title: "まだ、余裕。",  desc: "ブランドの紺で、リストの背景に。今日は、別のことに集中していい。",   n: "11d",  u: "あと" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function HomePageClient() {
  const navRef        = useRef<HTMLElement>(null);
  const phoneRef      = useRef<HTMLDivElement>(null);
  const heroMarkRef   = useRef<HTMLSpanElement>(null);
  const heroRightRef  = useRef<HTMLDivElement>(null);
  const hourRef       = useRef<HTMLSpanElement>(null);
  const minRef        = useRef<HTMLSpanElement>(null);
  const secRef        = useRef<HTMLSpanElement>(null);
  const b1TimerRef    = useRef<HTMLDivElement>(null);
  const ctaMarkRef    = useRef<HTMLSpanElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);
  const [errMsg,    setErrMsg]    = useState("");

  /* ── nav scroll shadow ── */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── IntersectionObserver reveal for [data-reveal] ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── phone countdown ── */
  useEffect(() => {
    let remaining = 7 * 3600 + 17 * 60 + 42;
    const tick = () => {
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      if (hourRef.current) hourRef.current.textContent = pad(h);
      if (minRef.current)  minRef.current.textContent  = pad(m);
      if (secRef.current)  secRef.current.textContent  = pad(s);
      remaining = Math.max(0, remaining - 1);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── bento b-1 timer d/h alternating ── */
  useEffect(() => {
    const el = b1TimerRef.current;
    if (!el) return;
    let big = 7, isDays = true;
    const id = setInterval(() => {
      if (isDays) {
        big = (big % 14) + 1;
        el.innerHTML = `${pad(big)}<span class="unit">d</span>`;
      } else {
        big = Math.max(1, (big + 3) % 24);
        el.innerHTML = `${pad(big)}<span class="unit">h</span>`;
      }
      isDays = !isDays;
    }, 2200);
    return () => clearInterval(id);
  }, []);

  /* ── hero parallax ── */
  useEffect(() => {
    const phone    = phoneRef.current;
    const heroMark = heroMarkRef.current;
    const heroRight = heroRightRef.current;
    if (!heroRight || !phone) return;

    let raf: number | null = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      const r = heroRight.getBoundingClientRect();
      targetX = (e.clientX - (r.left + r.width  / 2)) / r.width;
      targetY = (e.clientY - (r.top  + r.height / 2)) / r.height;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { targetX = targetY = 0; };

    function loop() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      phone!.style.transform = `rotate(${-3 + curX * 4}deg) translate(${curX * 12}px, ${curY * 10}px)`;
      if (heroMark) heroMark.style.transform = `rotate(${-6 + curX * 2}deg) translate(${curX * -22}px, ${curY * -16}px)`;
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    heroRight.addEventListener("mousemove", onMove);
    heroRight.addEventListener("mouseleave", onLeave);
    return () => {
      heroRight.removeEventListener("mousemove", onMove);
      heroRight.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── magnet buttons ── */
  useEffect(() => {
    type Handler = { btn: HTMLElement; move: (e: MouseEvent) => void; leave: () => void };
    const handlers: Handler[] = [];

    document.querySelectorAll<HTMLElement>(".lp-btn-magnet").forEach((btn) => {
      const move = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width  / 2);
        const y = e.clientY - (r.top  + r.height / 2);
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      };
      const leave = () => { btn.style.transform = ""; };
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);
      handlers.push({ btn, move, leave });
    });

    return () => handlers.forEach(({ btn, move, leave }) => {
      btn.removeEventListener("mousemove", move);
      btn.removeEventListener("mouseleave", leave);
    });
  }, []);

  /* ── CTA mark scroll drift ── */
  useEffect(() => {
    const ctaMark = ctaMarkRef.current;
    const cta     = ctaSectionRef.current;
    if (!ctaMark || !cta) return;

    const onScroll = () => {
      const r  = cta.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      ctaMark.style.transform = `rotate(${-10 + progress * 20}deg) scale(${0.92 + progress * 0.16})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── smooth anchor scroll (offset for fixed nav) ── */
  useEffect(() => {
    type H = { el: HTMLAnchorElement; fn: (e: Event) => void };
    const handlers: H[] = [];

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const fn = (e: Event) => {
        const id = a.getAttribute("href")?.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
      };
      a.addEventListener("click", fn);
      handlers.push({ el: a, fn });
    });

    return () => handlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
  }, []);

  /* ── CTA form submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setErrMsg("");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setErrMsg(data.error ?? "エラーが発生しました。");
      }
    } catch {
      setErrMsg("ネットワークエラーが発生しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ─── NAV ─── */}
      <nav ref={navRef} className="lp-nav" id="nav">
        <a href="#top" className="lp-nav-brand">
          <span className="lp-nav-seal">〆</span>
          <span>
            SHIMETRA
            <span style={{ color: "var(--ink-3)", marginLeft: 6, fontWeight: 500 }}>／〆トラ</span>
          </span>
        </a>
        <div className="lp-nav-links">
          <a href="#problem">課題</a>
          <a href="#how">使い方</a>
          <a href="#features">機能</a>
          <a href="#faq">FAQ</a>
          <a href="#pricing">料金</a>
        </div>
        <a href="#cta" className="lp-nav-cta">
          無料ではじめる <span className="arrow">→</span>
        </a>
      </nav>

      {/* ─── HERO ─── */}
      <header className="lp-hero" id="top">
        <div className="lp-hero-grid">

          {/* 左: コピー */}
          <div className="lp-hero-left">
            <div className="lp-eyebrow">
              <span className="dot" />
              2026 新卒 / 第二新卒 のための締切ノート
            </div>

            <h1 className="lp-hero-title">
              <span className="line"><span className="word">出さなきゃ、を</span></span>
              <span className="line"><span className="word"><em>出した</em>に。</span></span>
              <span className="line"><span className="word"><span className="accent">〆トラ。</span></span></span>
            </h1>

            <p className="lp-hero-sub">
              ES・説明会・面接の締切を一箇所に。<strong>72 / 24 / 3 時間前</strong>に、
              〆トラがメールでそっと教えてくれる。スマホに余計なアプリは要らない、メール一通だけの安心。
            </p>

            <div className="lp-hero-cta-row">
              <a href="#cta" className="lp-btn-magnet">
                無料ではじめる <span className="arrow">→</span>
              </a>
              <a href="#how" className="lp-btn-ghost">仕組みを見る</a>
            </div>

            <div className="lp-hero-bullets">
              <span className="lp-hero-bullet">アプリDL不要</span>
              <span className="lp-hero-bullet">マジックリンク認証</span>
              <span className="lp-hero-bullet">10件まで無料・広告なし</span>
            </div>
          </div>

          {/* 右: フォンモックアップ */}
          <div className="lp-hero-right" ref={heroRightRef}>
            <span className="lp-hero-mark" ref={heroMarkRef} aria-hidden="true">〆</span>

            <div className="lp-hero-chip chip-1">
              <span className="dot" />
              <div>
                <strong>残り 23:59:42</strong>
                <span>ES ・ Recruit Holdings</span>
              </div>
            </div>

            <div className="lp-hero-chip chip-3">
              <span className="dot" />
              <div>
                <strong>提出完了</strong>
                <span>freee ・ ES</span>
              </div>
            </div>

            <div className="lp-hero-chip chip-2">
              <span className="dot" />
              <div>
                <strong>メール通知 → 72h前</strong>
                <span>メルカリ ・ 面接</span>
              </div>
            </div>

            <div className="lp-phone" ref={phoneRef}>
              <div className="lp-phone-notch" />
              <div className="lp-phone-status">
                <span>9:41</span>
                <span className="right">●●●●● 5G ▮▮</span>
              </div>
              <div className="lp-phone-screen">
                <div className="lp-phone-header">
                  <div className="lp-phone-brand">
                    <span className="seal">〆</span>〆トラ
                  </div>
                  <div className="lp-phone-icons">
                    <span className="lp-phone-iconbtn">⌖<span className="pin">3</span></span>
                    <span className="lp-phone-iconbtn">⚙</span>
                  </div>
                </div>
                <div className="lp-phone-body">
                  <div className="lp-phone-greeting">
                    こんにちは、<span className="accent">悠真</span> さん。
                  </div>
                  <div className="lp-phone-hero">
                    <div className="lbl">次の〆切まで</div>
                    <div className="co">Recruit Holdings<span className="tag">ES</span></div>
                    <div className="timer">
                      <span className="seg"    ref={hourRef}>07</span><span className="unit">h</span>
                      <span className="seg sm" ref={minRef}>17</span><span className="unit">m</span>
                      <span className="seg sm" ref={secRef}>42</span><span className="unit">s</span>
                    </div>
                    <div className="bar"><div /></div>
                  </div>
                  <div className="lp-phone-list">
                    <div className="lp-phone-item u-today">
                      <span className="strip" />
                      <span className="ring">7h</span>
                      <div className="info">
                        <span className="kind">ES</span>
                        <div className="co">Recruit Holdings</div>
                        <div className="meta">本日 17:30 まで</div>
                      </div>
                      <span className="pill">未対応</span>
                    </div>
                    <div className="lp-phone-item u-soon">
                      <span className="strip" />
                      <span className="ring">1d</span>
                      <div className="info">
                        <span className="kind k-interview">面接</span>
                        <div className="co">メルカリ</div>
                        <div className="meta">5/14 14:00</div>
                      </div>
                      <span className="pill">未対応</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-scroll-cue">
          SCROLL<span className="line" />
        </div>
      </header>

      {/* ─── MARQUEE ─── */}
      <section className="lp-marquee" aria-hidden="true">
        <div className="lp-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(([big, small], i) => (
            <span key={i} className="lp-marquee-item">
              <span className="sep">〆</span>
              <span>{big}</span>
              <span className="small">{small}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="lp-problem" id="problem">
        <div className="lp-problem-grid">
          <div className="lp-problem-head" data-reveal="">
            <div className="lp-eyebrow"><span className="dot" />就活で、いちばん怖いこと</div>
            <h2>
              「<span className="strike">うっかり</span>」で、<br />
              志望企業を<br />
              逃してませんか。
            </h2>
            <p>
              志望度の高い企業ほど、ESも面接も日程が密集する。Excel・カレンダー・メール・
              各社のマイページ、情報源がバラけるほど、いちばん大事な一行が抜け落ちる。
            </p>
          </div>

          <div className="lp-stats-stack">
            <div className="lp-stat-row" data-reveal="">
              <div className="lp-stat-num">49.9<span className="pct">%</span></div>
              <p>
                就活生の約5割が、ES の締切が早すぎて応募できなかった企業があると回答。タイミングを逃した応募は取り戻せない。
                <span className="src">SOURCE — キャリタス就活 学生モニター調査 2026年卒（2025年4月 / n=1,134）</span>
              </p>
            </div>
            <div className="lp-stat-row" data-reveal="">
              <div className="lp-stat-num">12.4<span className="pct">社</span></div>
              <p>
                就活生1人あたりの ES 提出社数の平均。活動ピーク期は複数社の選考が同時進行する。
                <span className="src">SOURCE — 就職みらい研究所 就職白書2025（リクルート / 2025年2月）</span>
              </p>
            </div>
            <div className="lp-stat-row" data-reveal="">
              <div className="lp-stat-num">8.5<span className="pct">ヶ月</span></div>
              <p>
                就職活動の実質活動期間の平均。約8ヶ月以上にわたり、毎週のように誰かの締切が訪れる。
                <span className="src">SOURCE — 就職みらい研究所 就職白書2025（リクルート / 2025年2月）</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="lp-how" id="how">
        <div className="lp-how-head" data-reveal="">
          <div className="lp-eyebrow"><span className="dot" />How it works ／ 3 STEPS</div>
          <h2>メール一通で、<br /><em>締切を、見張る側に。</em></h2>
          <p>アプリのダウンロードは要りません。マジックリンクでログインして、締切を3つ登録するだけ。</p>
        </div>

        <div className="lp-how-steps">
          <article className="lp-step" data-reveal="">
            <div className="lp-step-num">STEP / 01 <span className="arrow">→</span></div>
            <h3>大学のメールで、マジックリンク認証。</h3>
            <p>パスワードもアプリも不要。〆トラから届くワンタップのリンクで、すぐにダッシュボードへ。</p>
            <div className="lp-step-visual">
              <div className="lp-sv-email">
                <span className="at">✉</span>
                <span>you@university.ac.<span className="ing">jp</span></span>
              </div>
              <div className="lp-sv-link">
                <span className="lbl">From / 〆トラ ・ INBOX</span>
                <span className="seal">〆</span>
                <span className="ttl">マジックリンクでログイン</span>
                <span className="desc">このリンクは 30 分間有効です。</span>
              </div>
            </div>
          </article>

          <article className="lp-step" data-reveal="">
            <div className="lp-step-num">STEP / 02 <span className="arrow">→</span></div>
            <h3>締切を、3 タップで登録。</h3>
            <p>企業名・種別・日時。種別はタイル選択、日時は「今夜23:59」などのクイックボタンから。</p>
            <div className="lp-step-visual">
              <div className="lp-sv-form">
                <div className="lp-sv-field">
                  <span className="k">COMPANY</span>
                  メルカリ
                </div>
                <div className="lp-sv-tiles">
                  <div className="lp-sv-tile">
                    <span className="ic">📝</span>
                    <span className="nm">ES</span>
                  </div>
                  <div className="lp-sv-tile on">
                    <span className="ic">🗣️</span>
                    <span className="nm">面接</span>
                  </div>
                  <div className="lp-sv-tile">
                    <span className="ic">📅</span>
                    <span className="nm">説明会</span>
                  </div>
                  <div className="lp-sv-tile">
                    <span className="ic">📌</span>
                    <span className="nm">その他</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="lp-step" data-reveal="">
            <div className="lp-step-num">STEP / 03 <span className="arrow">→</span></div>
            <h3>72/24/3 時間前に、メール通知。</h3>
            <p>常駐するアプリも、鳴り続けるプッシュもなし。受信箱に、3 通の静かなリマインド。</p>
            <div className="lp-step-visual">
              <div className="lp-sv-notif-stack">
                <div className="lp-sv-notif">
                  <span className="ic">〆</span>
                  <div>
                    <div className="row"><span>72H前</span><span>3日前</span></div>
                    <div className="ttl">メルカリ 面接まで残り 72 時間</div>
                    <div className="desc">そろそろ準備をはじめましょう。</div>
                  </div>
                </div>
                <div className="lp-sv-notif">
                  <span className="ic">〆</span>
                  <div>
                    <div className="row"><span>24H前</span><span>1日前</span></div>
                    <div className="ttl">残り 24 時間です</div>
                    <div className="desc">志望動機を最終確認しましょう。</div>
                  </div>
                </div>
                <div className="lp-sv-notif urgent">
                  <span className="ic">〆</span>
                  <div>
                    <div className="row"><span>3H前</span><span>もうすぐ</span></div>
                    <div className="ttl">あと 3 時間で締切です。</div>
                    <div className="desc">最後の一通、出してから寝ましょう。</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ─── URGENCY ─── */}
      <section className="lp-urgency" id="urgency">
        <div className="lp-urgency-head">
          <div data-reveal="">
            <div className="lp-eyebrow"><span className="dot" />緊急度 ・ 4 階調</div>
            <h2>色が、<em>時間の温度</em>を教える。</h2>
          </div>
          <p data-reveal="">
            締切までの残り時間で、自動的に色が変わります。赤＝期限切れ、橙＝当日、黄＝3日以内、紺＝通常。
            円形プログレスは、〆切までの「容量」が埋まっていく感覚を表現します。
          </p>
        </div>

        <div className="lp-urg-grid">
          {URG_CARDS.map(({ cls, off, label, title, desc, n, u }) => (
            <div
              key={cls}
              className={`lp-urg-card ${cls}`}
              style={{ "--off": off } as React.CSSProperties}
              data-reveal=""
            >
              <div>
                <div className="lbl">{label}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <div className="lp-urg-ring">
                <svg viewBox="0 0 120 120">
                  <circle className="bg" cx="60" cy="60" r="51" fill="none" strokeWidth="8" />
                  <circle className="fg" cx="60" cy="60" r="51" />
                </svg>
                <div className="center">
                  <span className="n">{n}</span>
                  <span className="u">{u}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES (bento) ─── */}
      <section className="lp-features" id="features">
        <div className="lp-features-head" data-reveal="">
          <div className="lp-eyebrow"><span className="dot" />FEATURES ／ 機能</div>
          <h2>必要なことだけ、<br />美しく。</h2>
        </div>

        <div className="lp-bento">
          <article className="lp-bento-cell b-1">
            <div>
              <span className="lp-b-icon">〆</span>
              <h3>巨大カウントダウン。<br />次の〆切に、視線を集中。</h3>
              <p>ダッシュボードの主役は、いつだって「次の一件」。残り時間を最大の文字で。</p>
            </div>
            <div>
              <div className="lp-b1-visual">
                <div className="lp-timer-big" ref={b1TimerRef}>
                  07<span className="unit">d</span>
                </div>
                <div className="lp-timer-meta">
                  <div className="k">NEXT ／ 次の締切</div>
                  <div className="v">Recruit ・ ES</div>
                </div>
              </div>
              <div className="lp-timer-bar"><div /></div>
            </div>
          </article>

          <article className="lp-bento-cell b-2">
            <span className="lp-b-icon">⌗</span>
            <h3>ワンタップ・ステータス更新。</h3>
            <p>カードのピルをタップで「未対応→提出済→完了」を循環。手数は最小。</p>
            <div className="lp-schedule" aria-hidden="true">
              <span>未対応</span><span>提出済</span><span>完了</span><span>辞退</span>
            </div>
          </article>

          <article className="lp-bento-cell b-3">
            <span className="lp-b-icon">⌘</span>
            <h3>4 種類の選考、ぜんぶ。</h3>
            <p>エントリーシート・説明会・面接・その他。色とアイコンで、瞬時に見分ける。</p>
            <div className="lp-kinds-row">
              <span className="k k-es">ES</span>
              <span className="k k-brief">説明会</span>
              <span className="k k-itv">面接</span>
              <span className="k k-other">その他</span>
            </div>
          </article>

          <article className="lp-bento-cell b-4">
            <span className="lp-b-icon">∞</span>
            <h3>クイック日時。</h3>
            <p>「今夜23:59」「明日朝9時」「3日後」。よくあるパターンを、1 タップで。</p>
          </article>

          <article className="lp-bento-cell b-5">
            <span className="lp-b-icon">◐</span>
            <h3>紙 / 墨、2 テーマ。</h3>
            <p>紙の温かみとも、深夜の墨ともつき合える。アクセントは 4 色から。</p>
            <div className="lp-theme-swatches">
              <span className="s1" /><span className="s2" /><span className="s3" /><span className="s4" />
            </div>
          </article>

          <article className="lp-bento-cell b-6">
            <span className="lp-b-icon">⌖</span>
            <h3>メール通知 ・ 72/24/3h。</h3>
            <p>プッシュ通知ではなく、メール。受信箱を就活の作戦本部に。</p>
            <div className="lp-schedule">
              <span>72h</span><span>24h</span><span>3h</span>
            </div>
          </article>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="lp-faq" id="faq">
        <div className="lp-faq-head">
          <div data-reveal="">
            <div className="lp-eyebrow"><span className="dot" />FAQ ／ よくある質問</div>
            <h2>気になって<br />いることに、答える。</h2>
          </div>
          <p data-reveal="">
            〆トラへの質問をまとめました。ここにない疑問は、お問い合わせよりどうぞ。
          </p>
        </div>

        <div className="lp-faq-list" data-reveal="">
          <details className="lp-faq-item">
            <summary>
              無料プランは本当に無料ですか？
              <i className="icon">+</i>
            </summary>
            <p className="ans">
              はい、<strong>クレジットカード不要・広告なし</strong>で、締切アイテム10件まで永続的に無料でご利用いただけます。
              有料のProプランは機能を拡張したい方向けで、無料プランのまま使い続けても自動的に課金されることはありません。
            </p>
          </details>

          <details className="lp-faq-item">
            <summary>
              アプリのダウンロードは必要ですか？
              <i className="icon">+</i>
            </summary>
            <p className="ans">
              不要です。〆トラはWebアプリです。スマートフォンでもPCでも、ブラウザからアクセスするだけで使えます。
              <strong>マジックリンク認証</strong>でパスワードの設定も不要なため、30秒でダッシュボードに入れます。
            </p>
          </details>

          <details className="lp-faq-item">
            <summary>
              通知はどのタイミングで届きますか？
              <i className="icon">+</i>
            </summary>
            <p className="ans">
              無料プランは締切の<strong>24時間前</strong>に1回、メール通知が届きます。
              Proプランでは<strong>72時間前・24時間前・3時間前</strong>の計3回通知します。
              プッシュ通知ではなくメール通知のため、アプリの常駐は不要です。
            </p>
          </details>

          <details className="lp-faq-item">
            <summary>
              どのメールアドレスでも登録できますか？
              <i className="icon">+</i>
            </summary>
            <p className="ans">
              大学のメールアドレス（<code>@ac.jp</code>）だけでなく、GmailやYahooメールなど一般的なメールアドレスでもご登録いただけます。
              通知はご登録のメールアドレスに届きます。
            </p>
          </details>

          <details className="lp-faq-item">
            <summary>
              Proプランはいつでも解約できますか？
              <i className="icon">+</i>
            </summary>
            <p className="ans">
              はい、<strong>いつでも解約可能</strong>です。解約後は翌月から課金が停止し、残りの期間はProプランの機能をそのままご利用いただけます。
              就活が終わったら気軽に解約してください。
            </p>
          </details>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-eyebrow"><span className="dot" />PRICING ／ 料金</div>
        <h2>就活の最中に、<br />お財布を開かせない。</h2>

        <div className="lp-price-cards" data-reveal="">
          {/* Free */}
          <div className="lp-price-card">
            <span className="lp-plan-label">FREE ／ 無料プラン</span>
            <div className="lp-price-tag">
              <span className="y">¥</span>
              <span className="n">0</span>
              <span className="u">/ 月</span>
            </div>
            <div className="note">クレジットカード不要・広告なし</div>
            <ul className="lp-price-list">
              {FREE_LIST.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <a
              href="#cta"
              className="lp-btn-magnet"
              style={{ width: "100%", justifyContent: "center" }}
            >
              無料ではじめる <span className="arrow">→</span>
            </a>
          </div>

          {/* Pro */}
          <div className="lp-price-card featured">
            <span className="lp-plan-label">
              PRO ／ プロプラン
              <span className="lp-price-badge">おすすめ</span>
            </span>
            <div className="lp-price-tag">
              <span className="y">¥</span>
              <span className="n">{PRO_PRICE_JPY}</span>
              <span className="u">/ 月</span>
            </div>
            <div className="note">税込・いつでも解約可能</div>
            <ul className="lp-price-list">
              {PRO_LIST.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link
              href="/login"
              className="lp-btn-magnet"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Pro ではじめる <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="lp-cta" id="cta" ref={ctaSectionRef}>
        <span className="lp-cta-mark" ref={ctaMarkRef} aria-hidden="true">〆</span>
        <div className="lp-cta-inner">
          <div className="lp-eyebrow"><span className="dot" />READY ／ あと、ひとつだけ。</div>
          <h2>締切を、<br /><em>味方に</em>変える。</h2>
          <p>メールアドレスを入れて、マジックリンクを受け取るだけ。30 秒で、ダッシュボードへ。</p>

          {submitted ? (
            <div className="lp-cta-sent">
              ✓ メールを送信しました。受信箱をご確認ください。
            </div>
          ) : (
            <form className="lp-cta-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="you@university.ac.jp"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" disabled={sending}>
                {sending ? "送信中..." : <>マジックリンクを送る <span className="arrow">→</span></>}
              </button>
            </form>
          )}
          {errMsg && (
            <p style={{ color: "var(--u-overdue)", marginTop: 12, fontSize: 14 }}>{errMsg}</p>
          )}
          <div className="lp-cta-foot">NO PASSWORDS ・ NO APP ・ NO ADS</div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="brand">
            <span className="seal">〆</span>
            SHIMETRA ／ 〆トラ
          </div>
          <div className="links">
            <Link href="/terms">利用規約</Link>
            <Link href="/privacy">プライバシー</Link>
            <Link href="/legal">特定商取引法</Link>
            <a href="mailto:support@shimetra.com">お問い合わせ</a>
          </div>
          <div>© 2026 SHIMETRA · MADE WITH 〆</div>
        </div>
      </footer>
    </>
  );
}
