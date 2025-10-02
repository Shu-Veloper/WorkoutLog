"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, User, X, ChevronDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const NavBar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // 인증 상태 확인
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
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
    setIsProfileMenuOpen(false);
    window.location.href = "/auth/login";
  };

  return (
    <nav className="bg-black text-white w-full">
      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Center - Logo */}
          <div className="flex-1 flex justify-center md:justify-start md:ml-6">
            <button
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
              onClick={() => (window.location.href = "/")}
            >
              Workout Log
            </button>
          </div>

          {/* Right side - Profile icon with dropdown */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleProfileMenu}
              className="text-white hover:bg-gray-800"
              aria-label="Profile menu"
            >
              <User className="h-6 w-6" />
            </Button>

            {/* Profile dropdown menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 min-w-48 max-w-80 bg-gray-900 rounded-md shadow-lg py-1 z-50">
                {user ? (
                  // 로그인된 사용자 메뉴
                  <>
                    <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700 whitespace-nowrap">
                      {user.email}
                    </div>
                    <a
                      href="/workouts"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Workouts
                    </a>
                    <a
                      href="/progress"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Progress
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Settings
                    </a>
                    <hr className="border-gray-700 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  // 로그인되지 않은 사용자 메뉴
                  <>
                    <button
                      onClick={handleSignIn}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <LogIn className="inline h-4 w-4 mr-2" />
                      로그인
                    </button>
                    <a
                      href="/auth/signup"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      회원가입
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
