"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  defaultIkhtibarLocale,
  ikhtibarT,
  type IkhtibarLocale,
  type IkhtibarMessageKey,
} from "./ikhtibar-dictionaries";

type IkhtibarLocaleContextValue = {
  locale: IkhtibarLocale;
  dir: "rtl" | "ltr";
  t: (key: IkhtibarMessageKey, vars?: Record<string, string | number>) => string;
  setLocale: (next: IkhtibarLocale) => void;
  /** Base URL for this landing route preserving locale (for links & hashes). */
  ikhtibarHref: (hash?: string) => string;
};

const IkhtibarLocaleContext = createContext<IkhtibarLocaleContextValue | null>(
  null,
);

export function IkhtibarLocaleProvider({
  locale,
  children,
}: {
  locale: IkhtibarLocale;
  children: ReactNode;
}) {
  const router = useRouter();

  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";

  const ikhtibarHref = useCallback(
    (hash = "") => {
      const base =
        locale === defaultIkhtibarLocale ? "/ikhtibar" : "/ikhtibar?lang=en";
      return `${base}${hash}`;
    },
    [locale],
  );

  const setLocale = useCallback(
    (next: IkhtibarLocale) => {
      router.push(
        next === defaultIkhtibarLocale ? "/ikhtibar" : "/ikhtibar?lang=en",
      );
    },
    [router],
  );

  const value = useMemo<IkhtibarLocaleContextValue>(
    () => ({
      locale,
      dir,
      t: (key, vars) => ikhtibarT(locale, key, vars),
      setLocale,
      ikhtibarHref,
    }),
    [locale, dir, setLocale, ikhtibarHref],
  );

  return (
    <IkhtibarLocaleContext.Provider value={value}>
      <div
        lang={locale === "ar" ? "ar" : "en"}
        dir={dir}
        className="min-h-screen"
      >
        {children}
      </div>
    </IkhtibarLocaleContext.Provider>
  );
}

export function useIkhtibarLocale() {
  const ctx = useContext(IkhtibarLocaleContext);
  if (!ctx) {
    throw new Error(
      "useIkhtibarLocale must be used within IkhtibarLocaleProvider",
    );
  }
  return ctx;
}
