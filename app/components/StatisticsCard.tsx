"use client";

import { useMemo } from "react";
import { WorkoutStats } from "@/types/workout";
import { mockWorkoutDays } from "@/data/mockWorkouts";
import { Calendar, Dumbbell, Flame } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// 원형 그래프용 색상 (컴포넌트 외부에 정의하여 불필요한 재생성 방지)
const PIE_COLORS = [
  "#3b82f6", // blue
  "#a855f7", // purple
  "#ef4444", // red
  "#22c55e", // green
  "#eab308", // yellow
  "#f97316", // orange
  "#ec4899", // pink
  "#06b6d4", // cyan
];

interface StatisticsCardProps {
  stats: WorkoutStats;
  viewMode?: "monthly" | "weekly";
}

export const StatisticsCard = ({
  stats,
  viewMode = "monthly",
}: StatisticsCardProps) => {
  const { mounted } = useTheme();
  const { t, locale, mounted: localeReady } = useLocale();

  // 부위별 분포를 배열로 변환 (차트용) - 언어 변경 시 재계산되도록 useMemo 사용
  const bodyPartArray = useMemo(() => {
    return Object.entries(stats.bodyPartDistribution)
      .map(([part, count]) => ({
        name: t(`bodyParts.${part}`),
        count,
        percentage: (
          (count /
            Object.values(stats.bodyPartDistribution).reduce(
              (a, b) => a + b,
              0
            )) *
          100
        ).toFixed(1),
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [stats.bodyPartDistribution, t]);

  // Chart.js 데이터 설정
  const pieChartData = useMemo(
    () => ({
      labels: bodyPartArray.map((item) => item.name),
      datasets: [
        {
          data: bodyPartArray.map((item) => item.count),
          backgroundColor: PIE_COLORS.slice(0, bodyPartArray.length),
          borderWidth: 0,
        },
      ],
    }),
    [bodyPartArray]
  );

  const pieChartOptions = useMemo(
    () => ({
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: { label?: string; raw: unknown }) => {
              return `${context.label || ""}: ${context.raw}${t(
                "statistics.times"
              )}`;
            },
          },
        },
      },
      maintainAspectRatio: false,
    }),
    [t]
  );

  // 클라이언트 마운트 전에는 스켈레톤 UI 표시
  if (!mounted || !localeReady) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {viewMode === "monthly"
            ? t("statistics.monthlyStats")
            : t("statistics.weeklyStats")}
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
            {t("statistics.monthly")}
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {t("statistics.weekly")}
          </button>
        </div>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 카드 1: 운동 일수 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("statistics.workoutDays")}
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {stats.totalWorkoutDays}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {t("statistics.days")}
            </span>
          </p>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {mockWorkoutDays
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((day) => (
                <div key={day.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString(
                      locale === "ja"
                        ? "ja-JP"
                        : locale === "en"
                        ? "en-US"
                        : "ko-KR",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {day.totalDurationMin || 0}
                    {t("statistics.minutes")}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* 카드 2: 부위별 운동 횟수 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Dumbbell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("statistics.bodyPartWorkouts")}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-1 text-xs max-h-24 overflow-y-auto">
              {bodyPartArray.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[idx] }}
                  />
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {item.name}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white ml-auto">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 카드 3: 오늘의 영양 섭취 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("statistics.todayNutrition")}
            </h3>
          </div>
          <div className="space-y-3">
            {/* 칼로리 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {t("statistics.calories")}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  1650 / 2000 kcal
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((1650 / 2000) * 100, 100)}%` }}
                />
              </div>
            </div>
            {/* 단백질 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {t("statistics.protein")}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  120 / 150 g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((120 / 150) * 100, 100)}%` }}
                />
              </div>
            </div>
            {/* 탄수화물 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {t("statistics.carbs")}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  200 / 250 g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((200 / 250) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
