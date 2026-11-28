import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const getLocaleData = cache(async () => {
  try {
    const requested = (await cookies()).get("yk-locale")?.value;
    const locale = requested
      ? await prisma.locale.findFirst({ where: { code: requested, isEnabled: true }, select: { code: true, direction: true } })
      : await prisma.locale.findFirst({ where: { isDefault: true, isEnabled: true }, select: { code: true, direction: true } });
    const code = locale?.code ?? "en";
    const entries = code === "en" ? [] : await prisma.contentTranslation.findMany({
      where: { localeCode: code, entityType: "ui", entityId: "storefront" },
      select: { fieldKey: true, value: true },
    });
    return { code, direction: locale?.direction ?? "ltr", labels: Object.fromEntries(entries.map(item => [item.fieldKey, item.value])) as Record<string,string> };
  } catch {
    return { code: "en", direction: "ltr", labels: {} as Record<string,string> };
  }
});
