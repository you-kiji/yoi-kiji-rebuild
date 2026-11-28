"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CartCount } from "@/components/cart-count";
import { LocaleSwitcher } from "@/components/locale-switcher";

type Category = { id: string; name: string; slug: string };
type Labels = Record<string,string>;
type Locale = { code:string; name:string; nativeName:string; isDefault:boolean; direction:string };
type SocialAccount = {id:string;label:string;url:string;platform:string};
type NavigationItem = {id:string;label:string;href:string;openInNewTab:boolean};

export function SiteHeaderClient({ categories, labels = {}, availableLocales = [], currentLocale = "en", socialAccounts = [], navigationItems = [] }: { categories: Category[]; labels?: Labels; availableLocales?: Locale[]; currentLocale?: string; socialAccounts?: SocialAccount[]; navigationItems?: NavigationItem[] }) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopRef = useRef<HTMLDetailsElement>(null);
  const mobileRef = useRef<HTMLDetailsElement>(null);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - previousY;
        if (currentY < 72) setHeaderHidden(false);
        else if (delta > 5) setHeaderHidden(true);
        else if (delta < -5) setHeaderHidden(false);
        previousY = currentY;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeMenus = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!desktopRef.current?.contains(target)) setDesktopOpen(false);
      if (!mobileRef.current?.contains(target)) setMobileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const text = (key: string, fallback: string) => labels[key] ?? fallback;
  const closeAll = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className={"site-header" + (headerHidden ? " site-header--hidden" : "")}>
      <Link className="wordmark" href="/" aria-label="YOI KIJI home" onClick={closeAll}>
        <span className="wordmark-main">YOI KIJI</span>
        <span className="wordmark-sub">THE ART OF TEXTILE LIVING</span>
      </Link>

      <nav className="desktop-navigation" aria-label="Main navigation">
        <Link href="/shop" onClick={closeAll}>{text("header.shop","Shop")}</Link>
        <details
          className="header-collections"
          ref={desktopRef}
          open={desktopOpen}
          onToggle={(event) => setDesktopOpen((event.currentTarget as HTMLDetailsElement).open)}
        >
          <summary
            aria-expanded={desktopOpen}
            onClick={(event) => {
              event.preventDefault();
              setDesktopOpen(value => !value);
            }}
          >{text("header.categories","Categories")}</summary>
          <div className="header-collections-menu">
            <Link href="/shop" onClick={closeAll}>{text("header.shopAllCategories","Shop all categories")}</Link>
            {categories.map(category => (
              <Link key={category.id} href={`/shop?category=${encodeURIComponent(category.slug)}`} onClick={closeAll}>
                {category.name}
              </Link>
            ))}
          </div>
        </details>
        <Link href="/our-story" onClick={closeAll}>{text("header.story","Our story")}</Link>
        <Link href="/journal" onClick={closeAll}>{text("header.journal","Journal")}</Link>
        {navigationItems.map(item=><Link key={item.id} href={item.href} target={item.openInNewTab?"_blank":undefined} rel={item.openInNewTab?"noopener noreferrer":undefined} onClick={closeAll}>{item.label}</Link>)}
      </nav>

      <details
        className="mobile-navigation"
        ref={mobileRef}
        open={mobileOpen}
        onToggle={(event) => setMobileOpen((event.currentTarget as HTMLDetailsElement).open)}
      >
        <summary
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={(event) => {
            event.preventDefault();
            setMobileOpen(value => !value);
          }}
        >{mobileOpen ? text("header.close","Close") : text("header.menu","Menu")}</summary>
        <nav aria-label="Mobile navigation">
          <LocaleSwitcher locales={availableLocales} currentCode={currentLocale} />
          <Link href="/shop" onClick={closeAll}>{text("header.shopAll","Shop all")}</Link>
          <p>{text("header.categories","Categories")}</p>
          {categories.map(category => (
            <Link key={category.id} href={`/shop?category=${encodeURIComponent(category.slug)}`} onClick={closeAll}>
              {category.name}
            </Link>
          ))}
          <Link href="/our-story" onClick={closeAll}>{text("header.story","Our story")}</Link>
          <Link href="/journal" onClick={closeAll}>{text("header.journal","Journal")}</Link>
          {navigationItems.map(item=><Link key={item.id} href={item.href} target={item.openInNewTab?"_blank":undefined} rel={item.openInNewTab?"noopener noreferrer":undefined} onClick={closeAll}>{item.label}</Link>)}
          <Link href="/search" onClick={closeAll}>{text("header.search","Search")}</Link>
          <Link href="/account" onClick={closeAll}>{text("header.account","Account")}</Link>
          <Link href="/cart" onClick={closeAll}>{text("header.bag","Bag")} <CartCount /></Link>
        </nav>
      </details>

      <div className="header-actions">
        <LocaleSwitcher locales={availableLocales} currentCode={currentLocale} />
        <Link href="/search" onClick={closeAll}>{text("header.search","Search")}</Link>
        <Link href="/account" onClick={closeAll}>{text("header.account","Account")}</Link>
        <Link className="bag-link" href="/cart" onClick={closeAll}>{text("header.bag","Bag")} <CartCount /></Link>
        {socialAccounts.map(account=><a key={account.id} href={account.url} target="_blank" rel="noopener noreferrer" aria-label={account.label}>{account.platform}</a>)}
      </div>
    </header>
  );
}
