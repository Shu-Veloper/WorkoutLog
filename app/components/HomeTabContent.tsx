"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { CalendarView } from "./CalendarView";
import { RecordingView } from "./RecordingView";

interface HomeTabContentProps {
  isRecordPage: boolean;
  onRecordPageChange: (isRecord: boolean) => void;
}

export const HomeTabContent = ({ isRecordPage, onRecordPageChange }: HomeTabContentProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8">
        {/* Loading state - static switch */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-md">
            <span className="text-xs md:text-sm font-semibold text-gray-500">
              달력
            </span>
            <Switch checked={false} onCheckedChange={() => {}} disabled />
            <span className="text-xs md:text-sm font-semibold text-gray-500">
              기록
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Home Tab: 달력/기록 전환 스위치 */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-md">
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
            onCheckedChange={onRecordPageChange}
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
        </div>
      </div>

      {/* 달력 또는 기록 페이지 */}
      {isRecordPage ? <RecordingView /> : <CalendarView />}
    </div>
  );
};
