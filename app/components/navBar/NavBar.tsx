"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, User, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NavBar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

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
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
