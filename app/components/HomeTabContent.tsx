"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { CalendarView } from "./CalendarView";
import { MemoView } from "./MemoView";
import { useLocale } from "@/contexts/LocaleContext";

export const HomeTabContent = () => {
  const [mounted, setMounted] = useState(false);
  const [isMemoView, setIsMemoView] = useState(false);
  const { t, mounted: localeReady } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !localeReady) {
    return (
      <div className="space-y-8">
        {/* Switch skeleton */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-md">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 dark:text-gray-400">{t("home.loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Calendar/Memo Switch */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-md">
          <span
            className={`text-xs md:text-sm font-semibold transition-colors ${
              !isMemoView
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("home.calendar")}
          </span>
          <Switch
            checked={isMemoView}
            onCheckedChange={setIsMemoView}
          />
          <span
            className={`text-xs md:text-sm font-semibold transition-colors ${
              isMemoView
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("home.memo")}
          </span>
        </div>
      </div>

      {/* View Content */}
      {isMemoView ? <MemoView /> : <CalendarView />}
    </div>
  );
};
