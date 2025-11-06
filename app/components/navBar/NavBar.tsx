"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogIn, LogOut, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavBarProps {
  isRecordPage: boolean;
  onViewChange: (isRecord: boolean) => void;
}

export const NavBar = ({ isRecordPage, onViewChange }: NavBarProps) => {
  const [mounted, setMounted] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
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
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                <span>WL</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 bg-gray-100 dark:bg-gray-700 px-3 md:px-6 py-2 md:py-3 rounded-full">
              <span className="text-xs md:text-sm font-semibold text-gray-500">
                달력
              </span>
              <Switch checked={false} onCheckedChange={() => {}} disabled />
              <span className="text-xs md:text-sm font-semibold text-gray-500">
                기록
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10"></div>
              <div className="w-20"></div>
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
              <span className="block md:hidden">WL</span>
              <span className="hidden md:block">WorkoutLog</span>
            </button>
          </div>

          {/* Center - View Toggle Switch */}
          {/* <div className="flex items-center gap-2 md:gap-3 bg-gray-100 dark:bg-gray-700 px-3 md:px-6 py-2 md:py-3 rounded-full">
            <span
              className={`text-xs md:text-sm font-semibold transition-colors ${
                !isRecordPage
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              달력
            </span>
            <Switch
              checked={isRecordPage}
              onCheckedChange={onViewChange}
            />
            <span
              className={`text-xs md:text-sm font-semibold transition-colors ${
                isRecordPage
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              기록
            </span>
          </div> */}

          {/* Right - Theme Toggle & Login Button or User Menu */}
          <div className="flex items-center gap-2">
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
                  <span className="hidden sm:inline">로그인</span>
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
                        <span>설정</span>
                      </a>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>로그아웃</span>
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
