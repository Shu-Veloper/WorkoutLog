"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogIn, LogOut, Settings, Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocale } from "@/contexts/LocaleContext";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const NavBar = () => {
  const [mounted, setMounted] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t, mounted: localeReady } = useLocale();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  // 인증 상태 확인
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setMounted(true);
    };

    getUser();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Outside click을 감지하여 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsProfileMenuOpen(false);
    window.location.href = "/";
  };

  const handleSignIn = () => {
    window.location.href = "/auth/login";
  };

  // 마운트 전 렌더링 (hydration 방지)
  if (!mounted || !localeReady) {
    return (
      <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                <span>WL</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center">
            <button
              className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => (window.location.href = "/")}
            >
              {/* 모바일: WL, 데스크톱: WorkoutLog */}
              <span className="block md:hidden">{t("nav.logoShort")}</span>
              <span className="hidden md:block">{t("nav.logo")}</span>
            </button>
          </div>

          {/* Right - Language, Theme Toggle & Login Button or User Menu */}
          <div className="flex items-center gap-2">
            {/* Language Toggle Button */}
            <div className="relative" ref={langMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLangMenu}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Change language"
              >
                <Languages className="h-5 w-5" />
              </Button>

              {/* Language dropdown menu */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={() => {
                      setLocale("ja");
                      setIsLangMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                      locale === "ja"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    日本語
                  </button>
                  <button
                    onClick={() => {
                      setLocale("en");
                      setIsLangMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                      locale === "en"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLocale("ko");
                      setIsLangMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                      locale === "ko"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    한국어
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <div className="relative" ref={menuRef}>
              {!user ? (
                <Button
                  onClick={handleSignIn}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 md:px-6 py-2 rounded-lg transition-colors text-xs md:text-sm"
                >
                  <LogIn className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                  <span className="hidden sm:inline">{t("nav.login")}</span>
                </Button>
              ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-1 md:gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 md:px-4 py-2 rounded-lg"
                  aria-label="Profile menu"
                >
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] md:max-w-[150px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                </Button>

                {/* Profile dropdown menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <a
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>{t("nav.settings")}</span>
                      </a>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("nav.logout")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
