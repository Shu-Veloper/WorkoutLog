"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

// 임시 메모 데이터 (나중에 DB 연동)
const mockMemos: Record<string, string> = {
  "2025-01-02": "휴식일",
  "2025-01-04": "등 운동 1시간 완료",
  "2025-01-10": "컨디션 좋음!",
};

export function MemoView() {
  const { t, locale, mounted: localeReady } = useLocale();
  const [mounted, setMounted] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [memos, setMemos] = React.useState<Record<string, string>>(mockMemos);
  const [editingMemos, setEditingMemos] = React.useState<Record<string, string>>({});

  // 오늘 날짜 ref (자동 스크롤용)
  const todayRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // 오늘 날짜 확인
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 현재 보고 있는 월이 오늘이 포함된 월인지 확인
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  // 마운트 후 오늘 날짜로 스크롤 (현재 월일 때만)
  React.useEffect(() => {
    if (mounted && isCurrentMonth && todayRef.current) {
      // 약간의 딜레이 후 스크롤 (렌더링 완료 대기)
      const timer = setTimeout(() => {
        todayRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, isCurrentMonth]);

  // 현재 월의 모든 날짜 가져오기
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  };

  // 날짜 포맷 (YYYY-MM-DD)
  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // 날짜 표시 포맷 (로케일에 따라)
  const formatDateDisplay = (date: Date) => {
    const day = date.getDate();
    const weekday = date.toLocaleDateString(locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : "en-US", {
      weekday: "short",
    });

    if (locale === "ja") {
      return `${day}日 (${weekday})`;
    } else if (locale === "ko") {
      return `${day}일 (${weekday})`;
    } else {
      return `${day} (${weekday})`;
    }
  };

  // 월 표시 포맷
  const formatMonthDisplay = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (locale === "ja") {
      return `${year}年 ${month}月`;
    } else if (locale === "ko") {
      return `${year}년 ${month}월`;
    } else {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    }
  };

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 메모 입력 핸들러
  const handleMemoChange = (dateKey: string, value: string) => {
    setEditingMemos((prev) => ({
      ...prev,
      [dateKey]: value,
    }));
  };

  // 메모 저장
  const handleSave = (dateKey: string) => {
    const value = editingMemos[dateKey];
    if (value && value.trim()) {
      setMemos((prev) => ({
        ...prev,
        [dateKey]: value.trim(),
      }));
      // TODO: DB 저장 API 호출
      console.log(`Saved memo for ${dateKey}: ${value.trim()}`);
    }
    // 편집 상태 초기화
    setEditingMemos((prev) => {
      const newState = { ...prev };
      delete newState[dateKey];
      return newState;
    });
  };

  // 메모 삭제
  const handleDelete = (dateKey: string) => {
    setMemos((prev) => {
      const newMemos = { ...prev };
      delete newMemos[dateKey];
      return newMemos;
    });
    setEditingMemos((prev) => {
      const newState = { ...prev };
      delete newState[dateKey];
      return newState;
    });
    // TODO: DB 삭제 API 호출
    console.log(`Deleted memo for ${dateKey}`);
  };

  // 현재 입력값 가져오기 (편집 중이면 편집값, 아니면 저장된 값)
  const getCurrentValue = (dateKey: string) => {
    if (dateKey in editingMemos) {
      return editingMemos[dateKey];
    }
    return memos[dateKey] || "";
  };

  // 저장된 메모가 있는지 확인
  const hasSavedMemo = (dateKey: string) => {
    return dateKey in memos && memos[dateKey].trim() !== "";
  };

  // 편집 중인지 확인
  const isEditing = (dateKey: string) => {
    return dateKey in editingMemos;
  };

  if (!mounted || !localeReady) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-500 dark:text-gray-400">{t("home.loading")}</div>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
      {/* 헤더: 월 선택 */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {formatMonthDisplay(currentDate)}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* 메모 리스트 */}
      <div ref={scrollContainerRef} className="space-y-2 max-h-[60vh] overflow-y-auto">
        {daysInMonth.map((day) => {
          const dateKey = formatDateKey(day);
          const currentValue = getCurrentValue(dateKey);
          const savedMemo = hasSavedMemo(dateKey);
          const editing = isEditing(dateKey);
          const isToday = dateKey === todayKey;

          return (
            <div
              key={dateKey}
              ref={isToday ? todayRef : null}
              className={`flex items-center gap-2 md:gap-4 py-2 px-2 md:px-4 rounded-lg transition-colors ${
                isToday
                  ? "bg-gray-100 dark:bg-gray-700 border-l-4 border-gray-500 dark:border-gray-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent"
              }`}
            >
              {/* 날짜 */}
              <div className={`w-20 md:w-28 flex-shrink-0 text-sm md:text-base ${
                isToday
                  ? "font-bold text-gray-900 dark:text-white"
                  : "font-medium text-gray-700 dark:text-gray-300"
              }`}>
                {formatDateDisplay(day)}
              </div>

              {/* 메모 입력 */}
              <div className="flex-1">
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMemoChange(dateKey, e.target.value)}
                  placeholder={t("home.memoPlaceholder")}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 저장/삭제 버튼 */}
              <div className="flex-shrink-0">
                {savedMemo && !editing ? (
                  // 저장된 메모가 있고 편집 중이 아니면 삭제 버튼
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(dateKey)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  // 새 입력이거나 편집 중이면 저장 버튼
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(dateKey)}
                    disabled={!currentValue.trim()}
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
