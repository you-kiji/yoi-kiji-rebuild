# YOI KIJI Rebuild — Existing Repository Audit

Audit source: `you-kiji/yoi-kiji-1`, branch `main`.
Audit commit: `f54bd831797bc4d08b482b2f026d2df992cec096`.
Target repository: `you-kiji/yoi-kiji-rebuild`.

> The source repository is preserved as a read-only reference for this rebuild. Do not delete, reset, rewrite, or commit to it.

## Existing project footprint

- Next.js 15 App Router, React 19, TypeScript, Node.js 22.
- PostgreSQL + Prisma 6; 24 SQL migration files.
- Zod validation, Vitest tests, PDFKit.
- 24 public storefront page files, 6 account page files, 30 admin page files.
- 61 API route files, 12 API test files, 63 shared component files.
- Existing integrations/configuration references: Razorpay, Delhivery serviceability, Amazon Shipping (ATS), Resend, WhatsApp Cloud API (opt-in), Cloudinary, GA4 consent, Neon/PostgreSQL, Vercel.

## Existing customer-facing capabilities to preserve

- Editorial homepage, global navigation/footer, contact enquiry form.
- Shop, category/collection, product detail, search and product reviews.
- Customer registration/login, signed HTTP-only sessions, password recovery.
- Account profile, delivery addresses, orders, order details, invoice/order document view, wishlist.
- Cart with server-side price validation.
- Checkout, stock reservation, checkout idempotency, Razorpay order creation, payment verification, webhook verification and payment retry.
- Order confirmation, cancellation, returns/shipping/legal pages.
- Journal/blog pages, localization and legal content pages.

## Existing admin capabilities to preserve

- Protected admin dashboard and role checks.
- Products, drafts/publishing, images, variants, product types and CSV import/export.
- Categories, inventory adjustments and movement ledger, stock alerts.
- Orders, fulfillment actions, refunds and exports.
- Customer records and customer notes/tags/activity (partial CRM foundation).
- Promotions/coupons, reviews moderation, reports and SEO.
- Blog content and taxonomy management.
- Media library and folders.
- Storefront content/section builder, brand settings, navigation, social accounts.
- Languages/translations and legal pages/revisions.

## Existing data model areas

Locale and translations; legal pages/revisions; users and addresses; catalog categories/products/variants/images; orders/order items/payments; inventory movements; notification logs; dynamic product types and attributes; homepage sections and collections; coupons/redemptions; reviews and wishlist; stock alerts; password reset tokens/logs; blog posts/categories/tags/related products; media folders/assets; customer notes/tags/assignments/activities; social accounts; navigation; storefront brand settings.

## Important gaps and production launch gates discovered

1. The source README explicitly says the project is under active development and is not build-verified or production-ready.
2. Checkout is intentionally disabled until payment credentials, seller tax details, approved shipping charges/rates, courier onboarding, real catalog data and legal policies are confirmed.
3. Delhivery currently has a PIN serviceability adapter; live shipment manifestation/booking is not enabled.
4. Amazon Shipping direct API integration is pending the seller's official account-specific API package.
5. The current printable order document is an order summary, not a statutory GST tax invoice. GSTIN, legal entity/address, HSN/SAC, tax treatment and invoice numbering need confirmation.
6. Customer CRM has notes, tags and activity records, but the audited tree does not show a dedicated full CRM workflow.
7. Referral/rewards wallet and ledger implementation was not found in the audited source tree; this remains a net-new feature if still required.
8. Email uses Resend configuration. WhatsApp requires Meta Cloud API configuration, an approved template and explicit customer opt-in.
9. The source launch checklist requires verified product SKUs, dimensions, material, care instructions, prices, stock and approved photography.

## Rebuild design constraints

- Global page/section background: `#e9e9e9`.
- Brand deep green: `#0e300e`, restricted to approved brand text, buttons, borders and accents.
- No full-page or full-section deep-green backgrounds unless the client explicitly approves.
- Preserve the approved premium Japanese-inspired minimalist direction; no unapproved redesign.
- Rebuild cleanly in this repository; do not copy known build/CI defects from the source.

## Delivery control

- Target handover: Sunday, 29 November 2026, evening (IST).
- Existing client domain is the intended production domain.
- Credentials are reported available, but each integration must still be tested against the correct staging/production account and verified end-to-end.
- Do not switch DNS or trigger a production deployment without explicit user approval.
- Mark a feature complete only after implementation and verification; disclose any item that cannot safely pass acceptance by the deadline.
