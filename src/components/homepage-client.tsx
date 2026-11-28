"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = { imageUrl: string; imageAlt?: string };
type Product = { id: string; name: string; slug: string; pricePaise: number; image?: string | null; imageAlt?: string | null };
type GalleryImage = { imageUrl: string; imageAlt?: string };
type Review = { id: string; rating: number; title?: string | null; body: string; customerName: string; verifiedPurchase: boolean };
type Article = { id: string; title: string; slug: string; excerpt?: string | null; coverImageUrl?: string | null; coverImageAlt?: string | null; publishedAt?: string | null };

function SectionHeading({ children, href, count }: { children: React.ReactNode; href: string; count: number }) {
  return <div className="yk-section-heading"><h2>{children}</h2>{count > 6 && <Link href={href} className="yk-view-all">View all <span aria-hidden="true">↗</span></Link>}</div>;
}

function HorizontalTrack({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  return <div className="yk-track-wrap"><div ref={track} className="yk-horizontal-track" aria-label={label}>{children}</div></div>;
}

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);
  if (!slides.length) return <div className="yk-hero-empty" aria-hidden="true" />;
  return <section className="yk-hero" aria-label="YOI KIJI image collection">
    {slides.map((slide, index) => <div className={"yk-hero-slide" + (index === active ? " is-active" : "")} key={slide.imageUrl + index} aria-hidden={index !== active}>
      <Image src={slide.imageUrl} alt={slide.imageAlt || ""} fill priority={index === 0} sizes="100vw" quality={90} />
    </div>)}
    {slides.length > 1 && <div className="yk-hero-progress" aria-hidden="true">{slides.map((_, index) => <span key={index} className={index === active ? "is-active" : ""} />)}</div>}
  </section>;
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return <section className="yk-home-section yk-products-section">
    <SectionHeading href="/shop" count={products.length}>Featured Products</SectionHeading>
    <HorizontalTrack label="Featured products">
      {products.slice(0, 6).map(product => <Link className="yk-product-card" href={"/product/" + product.slug} key={product.id}>
        <div className="yk-product-image">{product.image ? <Image src={product.image} alt={product.imageAlt || product.name} fill sizes="(max-width: 640px) 72vw, 28vw" /> : <span className="yk-image-placeholder" />}</div>
        <div className="yk-product-meta"><h3>{product.name}</h3><p>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.pricePaise / 100)}</p></div>
      </Link>)}
    </HorizontalTrack>
  </section>;
}

export function GallerySection({ images }: { images: GalleryImage[] }) {
  if (!images.length) return null;
  return <section className="yk-home-section yk-gallery-section">
    <div className="yk-section-heading"><h2>Gallery</h2></div>
    <div className="yk-gallery-grid">{images.slice(0, 16).map((image, index) => <div className={"yk-gallery-item yk-gallery-item-" + (index % 8)} key={image.imageUrl + index}>
      <Image src={image.imageUrl} alt={image.imageAlt || "YOI KIJI textile and home collection"} fill sizes="(max-width: 640px) 48vw, 24vw" />
    </div>)}</div>
  </section>;
}

export function TextMarquee({ text }: { text: string }) {
  if (!text.trim()) return null;
  return <section className="yk-marquee" aria-label={text}><div className="yk-marquee-track" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>{text}<i>✳</i></span>)}</div></section>;
}

export function CustomerReviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  return <section className="yk-home-section yk-reviews-section">
    <SectionHeading href="/reviews" count={reviews.length}>Customer Reviews</SectionHeading>
    <HorizontalTrack label="Customer reviews">
      {reviews.slice(0, 6).map(review => <article className="yk-review-card" key={review.id}>
        <div className="yk-review-stars" aria-label={review.rating + " out of 5 stars"}>{"★".repeat(Math.max(0, Math.min(5, review.rating)))}<span>{"★".repeat(5 - Math.max(0, Math.min(5, review.rating)))}</span></div>
        {review.title && <h3>{review.title}</h3>}<p className="yk-review-body">“{review.body}”</p>
        <div className="yk-review-author"><strong>{review.customerName}</strong>{review.verifiedPurchase && <span>Verified purchase</span>}</div>
      </article>)}
    </HorizontalTrack>
  </section>;
}

export function JournalSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return <section className="yk-home-section yk-journal-section">
    <SectionHeading href="/journal" count={articles.length}>Your Kiji Blogs</SectionHeading>
    <HorizontalTrack label="YOI KIJI journal articles">
      {articles.slice(0, 6).map(article => <Link className="yk-blog-card" href={"/journal/" + article.slug} key={article.id}>
        <div className="yk-blog-image">{article.coverImageUrl ? <Image src={article.coverImageUrl} alt={article.coverImageAlt || article.title} fill sizes="(max-width: 640px) 78vw, 30vw" /> : <span className="yk-image-placeholder" />}</div>
        <div className="yk-blog-copy"><span className="yk-blog-kicker">THE YOI KIJI JOURNAL</span><h3>{article.title}</h3>{article.excerpt && <p>{article.excerpt}</p>}<span className="yk-blog-read">Read story <i aria-hidden="true">↗</i></span></div>
      </Link>)}
    </HorizontalTrack>
  </section>;
}
