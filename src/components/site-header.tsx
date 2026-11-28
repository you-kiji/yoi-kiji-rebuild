import { getActiveCategories } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { SiteHeaderClient } from "@/components/site-header-client";
import { getLocaleData } from "@/lib/i18n";

export async function SiteHeader() {
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = [];
  try {
    categories = await getActiveCategories();
  } catch {
    // Keep navigation available when catalogue data is temporarily unavailable.
  }
  const roots = categories
    .filter(category => category.showInMenu)
    .map(({ id, name, slug }) => ({ id, name, slug }));

  const locale = await getLocaleData();
  const [categoryTranslations, availableLocales, socialAccounts, navigationItems] = await Promise.all([
    locale.code === "en"
      ? Promise.resolve([])
      : prisma.contentTranslation.findMany({
          where: { localeCode: locale.code, entityType: "category", entityId: { in: roots.map(item => item.id) }, fieldKey: "name" },
          select: { entityId: true, value: true },
        }).catch(() => []),
    prisma.locale.findMany({
      where: { isEnabled: true },
      select: { code: true, name: true, nativeName: true, isDefault: true, direction: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }).catch(() => []),
    prisma.socialAccount.findMany({where:{isActive:true,placement:{in:["header","both"]}},orderBy:{sortOrder:"asc"},select:{id:true,label:true,url:true,platform:true}}).catch(()=>[]),
    prisma.storeNavigationItem.findMany({where:{isActive:true,location:"HEADER"},orderBy:[{sortOrder:"asc"},{createdAt:"asc"}],select:{id:true,label:true,href:true,openInNewTab:true}}).catch(()=>[]),
  ]);
  const names = new Map(categoryTranslations.map(item => [item.entityId, item.value]));
  const localizedRoots = roots.map(item => ({ ...item, name: names.get(item.id) ?? item.name }));
  return <SiteHeaderClient categories={localizedRoots} labels={locale.labels} availableLocales={availableLocales} currentLocale={locale.code} socialAccounts={socialAccounts} navigationItems={navigationItems} />;
}
