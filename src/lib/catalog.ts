import { prisma } from "@/lib/prisma";



export async function getActiveCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, description: true, imageUrl: true, parentId: true, showInMenu: true, seoTitle: true, seoDescription: true, sortOrder: true },
    });
  } catch {
    return [];
  }
}

export async function getActiveCategoryBySlug(slug: string) {
  const categories = await getActiveCategories();
  return categories.find(category => category.slug === slug) ?? null;
}

export async function getCategoryBranchIds(categoryId: string) {
  const categories = await getActiveCategories();
  const ids = new Set<string>([categoryId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }
  return [...ids];
}

export async function getActiveProducts(categorySlug?: string) {
  try {
    let categoryIds: string[] | undefined;
    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug }, select: { id: true, isActive: true } });
      if (!category?.isActive) return [];
      categoryIds = await getCategoryBranchIds(category.id);
    }
    return await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoryIds ? { OR: [
          { categoryId: { in: categoryIds } },
          { categoryLinks: { some: { categoryId: { in: categoryIds } } } },
        ] } : {}),
      },
      include: {
        images: { where: { variantId: null }, orderBy: [{ isPrimary: "desc" }, { position: "asc" }], take: 1 },
        category: true,
        categoryLinks: { include: { category: true } },
        variants: { where: { isActive: true }, orderBy: { label: "asc" } },
        // Category pages use these relations to build live, product-type-aware filters.
        attributeValues: { include: { attribute: true } },
        productType: { include: { attributes: { include: { attribute: true }, orderBy: { sortOrder: "asc" } } } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getActiveProductBySlug(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        images: { where: { variantId: null }, orderBy: [{ isPrimary: "desc" }, { position: "asc" }] },
        category: true,
        categoryLinks: { include: { category: true } },
        variants: {
          where: { isActive: true },
          orderBy: { label: "asc" },
          include: { images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }] } },
        },
        attributeValues: { include: { attribute: true } },
        productType: true,
      },
    });
  } catch {
    return null;
  }
}
