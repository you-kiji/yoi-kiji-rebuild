"use client";
import { useEffect, useRef, useState } from "react";

type Locale = { code: string; name: string; nativeName: string; isDefault: boolean; direction: string };

export function LocaleSwitcher({ locales = [], currentCode = "en" }: { locales?: Locale[]; currentCode?: string }) {
  const [current, setCurrent] = useState(currentCode);
  const rootRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )yk-locale=([^;]+)/);
    if (match) setCurrent(decodeURIComponent(match[1]));
    const close = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) rootRef.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && rootRef.current) rootRef.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  if (locales.length < 2) return null;
  const selected = locales.find(locale => locale.code === current) ?? locales.find(locale => locale.isDefault) ?? locales[0];
  function choose(code: string) {
    if (code === current) {
      if (rootRef.current) rootRef.current.open = false;
      return;
    }
    setCurrent(code);
    document.cookie = `yk-locale=${encodeURIComponent(code)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <details className="locale-switcher" ref={rootRef}>
      <summary className="locale-switcher__trigger" aria-label="Choose language">
        <span className="locale-switcher__code">{selected.code}</span>
        <span>{selected.nativeName}</span>
      </summary>
      <div className="locale-switcher__menu" role="group" aria-label="Available languages">
        {locales.map(locale => (
          <button
            type="button"
            className="locale-switcher__option"
            key={locale.code}
            aria-current={locale.code === current ? "true" : undefined}
            onClick={() => choose(locale.code)}
          >
            <span>{locale.nativeName}<span className="locale-switcher__native"> · {locale.name}</span></span>
            {locale.code === current && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </details>
  );
}
