import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customer Reviews | YOI KIJI", description: "Stories and reviews shared by YOI KIJI customers." };

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    select: { id: true, rating: true, title: true, body: true, verifiedPurchase: true, createdAt: true, user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return <main className="yk-reviews-page">
    <header><p>THE YOI KIJI EXPERIENCE</p><h1>Customer Reviews</h1><span>Kind words from our community.</span></header>
    <div className="yk-reviews-list">{reviews.map(review => <article key={review.id}>
      <div className="yk-review-stars" aria-label={review.rating + " out of 5 stars"}>{"★".repeat(Math.max(0, Math.min(5, review.rating)))}<span>{"★".repeat(5 - Math.max(0, Math.min(5, review.rating)))}</span></div>
      {review.title && <h2>{review.title}</h2>}<p>“{review.body}”</p>
      <footer><strong>{review.user.name || "YOI KIJI Customer"}</strong>{review.verifiedPurchase && <span>Verified purchase</span>}</footer>
    </article>)}</div>
  </main>;
}
