"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Locale = "ja" | "en" | "ko";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  mounted: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ja");
  const [messages, setMessages] = useState<Record<string, unknown>>({});
  const [mounted, setMounted] = useState(false);

  // 메시지 로드 함수
  const loadMessages = async (loc: Locale) => {
    try {
      const msgs = await import(`../messages/${loc}.json`);
      setMessages(msgs.default);
    } catch (error) {
      console.error(`Failed to load messages for locale: ${loc}`, error);
    }
  };

  // 초기 로케일 로드
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    const initialLocale = savedLocale || "ja";

    if (initialLocale !== locale) {
      setLocaleState(initialLocale);
    }

    loadMessages(initialLocale).then(() => {
      setMounted(true);
    });
  }, []);

  // 로케일 변경
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    loadMessages(newLocale);
  };

  // 번역 함수
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // 키를 찾지 못하면 키 자체를 반환
      }
    }

    return typeof value === "string" ? value : key;
  };

  // 항상 Provider를 렌더링하되, mounted 상태를 Context에 포함
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, mounted }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    // LocaleProvider가 아직 마운트되지 않은 경우 기본값 반환
    return {
      locale: "ja" as Locale,
      setLocale: () => {},
      t: (key: string) => key,
      mounted: false,
    };
  }
  return context;
}
