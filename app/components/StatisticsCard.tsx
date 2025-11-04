"use client";

import { WorkoutStats } from "@/types/workout";
import { bodyPartNames } from "@/data/mockWorkouts";
import { Calendar, Dumbbell, TrendingUp, Award, Flame } from "lucide-react";

interface StatisticsCardProps {
  stats: WorkoutStats;
  viewMode?: 'monthly' | 'weekly';
}

export const StatisticsCard = ({ stats, viewMode = 'monthly' }: StatisticsCardProps) => {
  // 부위별 분포를 배열로 변환 (차트용)
  const bodyPartArray = Object.entries(stats.bodyPartDistribution)
    .map(([part, count]) => ({
      name: bodyPartNames[part as keyof typeof bodyPartNames],
      count,
      percentage: ((count / Object.values(stats.bodyPartDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

  // 부위별 색상 매핑
  const colorMap: Record<string, string> = {
    '등': 'bg-blue-500',
    '어깨': 'bg-purple-500',
    '가슴': 'bg-red-500',
    '이두': 'bg-green-500',
    '삼두': 'bg-yellow-500',
    '다리': 'bg-orange-500',
    '복근': 'bg-pink-500',
    '유산소': 'bg-cyan-500',
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {viewMode === 'monthly' ? '월별 통계' : '주별 통계'}
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
            월별
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            주별
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
              운동 일수
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {stats.totalWorkoutDays}
            <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">일</span>
          </p>
        </div>

        {/* 카드 2: 총 중량 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Dumbbell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              총 중량
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {(stats.totalWeight / 1000).toFixed(1)}
            <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">톤</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            총 {stats.totalSets} 세트
          </p>
        </div>

        {/* 카드 3: 연속 운동 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              연속 운동
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {stats.streak}
            <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">일</span>
          </p>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 font-medium">
            🔥 Great streak!
          </p>
        </div>
      </div>

      {/* 부위별 분포 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            부위별 운동 분포
          </h3>
        </div>

        {/* 가로 바 차트 */}
        <div className="space-y-3">
          {bodyPartArray.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {item.count}회 ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`${colorMap[item.name] || 'bg-gray-500'} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP 운동 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            가장 많이 한 운동
          </h3>
        </div>

        <div className="space-y-3">
          {stats.topExercises.map((exercise, idx) => (
            <div
              key={exercise.name}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                idx === 0 ? 'bg-yellow-500' :
                idx === 1 ? 'bg-gray-400' :
                'bg-orange-600'
              }`}>
                {idx + 1}
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-white">
                {exercise.name}
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-semibold">
                {exercise.count}회
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
