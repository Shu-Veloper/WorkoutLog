"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { WorkoutDay } from "@/types/workout";
import { mockWorkoutDays, mockStats } from "@/data/mockWorkouts";
import { WorkoutDayCard } from "./WorkoutDayCard";
import { StatisticsCard } from "./StatisticsCard";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { useLocale } from "@/contexts/LocaleContext";

export function CalendarView() {
  const { t, mounted: localeReady } = useLocale();
  const [mounted, setMounted] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [selectedWorkout, setSelectedWorkout] = React.useState<WorkoutDay | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const today = new Date();
    setDate(today);
    setMounted(true);
  }, []);

  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // 해당 날짜에 운동 데이터가 있는지 확인
  const getWorkoutForDate = (date: Date): WorkoutDay | undefined => {
    const dateStr = formatDate(date);
    return mockWorkoutDays.find(workout => workout.date === dateStr);
  };

  // 날짜 클릭 핸들러
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const workout = getWorkoutForDate(selectedDate);
      if (workout) {
        setSelectedWorkout(workout);
        setIsModalOpen(true);
      }
    }
  };

  // 클라이언트 마운트 전에는 서버와 동일한 빈 상태 렌더링
  if (!mounted || !localeReady) {
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ワークアウトカレンダー
          </h2>
          <div className="flex justify-center items-center h-96">
            <div className="text-gray-500 dark:text-gray-400">読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WorkoutProvider workoutDays={mockWorkoutDays}>
      <div className="space-y-8">
        {/* 달력 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("home.workoutCalendar")}
          </h2>
          <div className="flex justify-center overflow-x-auto">
            <div className="w-full max-w-4xl min-w-fit">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border shadow-sm w-full [--cell-size:theme(spacing.10)] sm:[--cell-size:theme(spacing.12)] md:[--cell-size:theme(spacing.16)]"
                captionLayout="dropdown"
                modifiers={{
                  workout: (day) => {
                    return mockWorkoutDays.some(
                      workout => workout.date === formatDate(day)
                    );
                  }
                }}
                modifiersStyles={{
                  workout: {
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    position: 'relative'
                  }
                }}
              />
            </div>
          </div>

          {/* 범례 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span>{t("bodyParts.back")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span>{t("bodyParts.shoulder")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>{t("bodyParts.chest")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>{t("bodyParts.biceps")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span>{t("bodyParts.triceps")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500" />
              <span>{t("bodyParts.legs")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-pink-500" />
              <span>{t("bodyParts.abs")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-cyan-500" />
              <span>{t("bodyParts.cardio")}</span>
            </div>
          </div>
        </div>

        {/* 통계 섹션 */}
        <StatisticsCard stats={mockStats} viewMode="monthly" />

        {/* 운동 상세 모달 */}
        {isModalOpen && selectedWorkout && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedWorkout(null);
            }}
          >
            <div
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <WorkoutDayCard
                workoutDay={selectedWorkout}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedWorkout(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </WorkoutProvider>
  );
}
