import { prisma } from "@/lib/prisma";
import { getLocaleData } from "@/lib/i18n";
export async function AnnouncementBar() {
  const section = await prisma.homepageSection.findFirst({ where: { key: "announcement", isActive: true } }).catch(() => null);
  if (!section) return null;
  const locale = await getLocaleData();
  const translations = locale.code === "en" ? [] : await prisma.contentTranslation.findMany({ where: { localeCode: locale.code, entityType: "homepageSection", entityId: section.id, fieldKey: { in: ["title", "body"] } }, select: { fieldKey: true, value: true } }).catch(() => []);
  const copy = new Map(translations.map(item => [item.fieldKey, item.value]));
  const title = copy.get("title") ?? section.title;
  const body = copy.get("body") ?? section.body;
  if (!title && !body) return null;
  return <div className="announcement"><span>{title}</span>{title && body && <i aria-hidden="true">✳</i>}{body && <span>{body}</span>}</div>;
}
