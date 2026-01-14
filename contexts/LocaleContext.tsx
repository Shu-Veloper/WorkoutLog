"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Locale = "ja" | "en" | "ko";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  mounted: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({ children, initialLocale = "ja" }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
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

  // 초기 로케일 로드 (마운트 시 1회만 실행)
  useEffect(() => {
    // localStorage에 저장된 값이 있으면 우선 사용 (사용자가 직접 선택한 경우)
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    const targetLocale = savedLocale || initialLocale;

    setLocaleState(targetLocale);
    loadMessages(targetLocale).then(() => {
      setMounted(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로케일 변경 (localStorage + 쿠키 모두 업데이트)
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // 쿠키도 업데이트 (서버와 동기화)
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
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
