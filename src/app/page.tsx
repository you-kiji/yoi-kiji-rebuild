import { prisma } from "@/lib/prisma";
import { HeroSlider, FeaturedProducts, GallerySection, TextMarquee, CustomerReviews, JournalSection } from "@/components/homepage-client";
import "./homepage.css";

export const dynamic = "force-dynamic";

type CmsSection = { slides?: unknown; settings?: unknown; body?: string | null };
type ImageSlide = { imageUrl?: string; imageAlt?: string };
const asSlides = (value: unknown): ImageSlide[] => Array.isArray(value) ? value.filter((item): item is ImageSlide => !!item && typeof item === "object" && typeof (item as ImageSlide).imageUrl === "string" && !!(item as ImageSlide).imageUrl) : [];

export default async function HomePage() {
  const [hero, gallery, marquee, productsSection, reviewSection, blogSection, products, reviews, articles] = await Promise.all([
    prisma.homepageSection.findUnique({ where: { key: "hero-slider" } }).catch(() => null),
    prisma.homepageSection.findUnique({ where: { key: "gallery" } }).catch(() => null),
    prisma.homepageSection.findUnique({ where: { key: "text-strip" } }).catch(() => null),
    prisma.homepageSection.findUnique({ where: { key: "featured-products" } }).catch(() => null),
    prisma.homepageSection.findUnique({ where: { key: "customer-reviews" } }).catch(() => null),
    prisma.homepageSection.findUnique({ where: { key: "blogs" } }).catch(() => null),
    prisma.product.findMany({ where: { isActive: true, noIndex: false }, select: { id: true, name: true, slug: true, pricePaise: true, images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }], take: 1, select: { url: true, alt: true } } }, orderBy: { updatedAt: "desc" }, take: 7 }).catch(() => []),
    prisma.review.findMany({ where: { status: "APPROVED" }, select: { id: true, rating: true, title: true, body: true, verifiedPurchase: true, user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 7 }).catch(() => []),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED", noIndex: false }, select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, coverImageAlt: true, publishedAt: true }, orderBy: { publishedAt: "desc" }, take: 7 }).catch(() => []),
  ]);

  const heroSlides = hero?.isActive ? asSlides(hero.slides) : [];
  const gallerySlides = gallery?.isActive ? asSlides(gallery.slides) : [];
  const productCards = products.map(product => ({ id: product.id, name: product.name, slug: product.slug, pricePaise: product.pricePaise, image: product.images[0]?.url ?? null, imageAlt: product.images[0]?.alt ?? null }));
  const reviewCards = reviews.map(review => ({ id: review.id, rating: review.rating, title: review.title, body: review.body, verifiedPurchase: review.verifiedPurchase, customerName: review.user.name || "YOI KIJI Customer" }));
  const blogCards = articles.map(article => ({ ...article, publishedAt: article.publishedAt?.toISOString() ?? null }));

  return <main className="yk-homepage">
    <HeroSlider slides={heroSlides} />
    <FeaturedProducts products={productsSection?.isActive === false ? [] : productCards} />
    <GallerySection images={gallerySlides} />
    <TextMarquee text={marquee?.isActive ? marquee.body || "" : ""} />
    <CustomerReviews reviews={reviewSection?.isActive === false ? [] : reviewCards} />
    <JournalSection articles={blogSection?.isActive === false ? [] : blogCards} />
  </main>;
}
