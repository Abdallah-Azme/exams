import type { Metadata } from "next";
import { IkhtibarLocaleProvider } from "@/src/modules/ikhtibar/i18n/ikhtibar-locale-context";
import {
  ikhtibarT,
  parseIkhtibarLocale,
} from "@/src/modules/ikhtibar/i18n/ikhtibar-dictionaries";
import { IkhtibarFooter } from "@/src/modules/ikhtibar/components/ikhtibar-footer";
import { IkhtibarHeader } from "@/src/modules/ikhtibar/components/ikhtibar-header";
import { IkhtibarHero } from "@/src/modules/ikhtibar/components/ikhtibar-hero";
import { IkhtibarStatsBanner } from "@/src/modules/ikhtibar/components/ikhtibar-stats-banner";
import { IkhtibarTestimonials } from "@/src/modules/ikhtibar/components/ikhtibar-testimonials";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  const locale = parseIkhtibarLocale(lang);
  return {
    title: ikhtibarT(locale, "metaTitle"),
    description: ikhtibarT(locale, "metaDescription"),
    openGraph: {
      title: ikhtibarT(locale, "metaTitle"),
      description: ikhtibarT(locale, "metaOgDescription"),
      locale: locale === "ar" ? "ar_EG" : "en_US",
    },
  };
}

export default async function IkhtibarPublicPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const locale = parseIkhtibarLocale(lang);

  return (
    <IkhtibarLocaleProvider locale={locale}>
      <IkhtibarHeader />
      <main>
        <IkhtibarHero />
        <IkhtibarTestimonials />
        <IkhtibarStatsBanner />
      </main>
      <IkhtibarFooter />
    </IkhtibarLocaleProvider>
  );
}
