"use client";

import dynamic from "next/dynamic";

const CalendarContorll = dynamic(
  () =>
    import("./CalendarContorll").then((mod) => ({
      default: mod.CalendarContorll,
    })),
  {
    ssr: false,
  }
);

export const DashboardContent = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Calendar Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 달력</h2>
        <div className="flex justify-center">
          <CalendarContorll />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Workout Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">오늘의 운동 요약</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">완료한 운동 수</span>
              <span className="text-2xl font-bold text-black">3개</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">총 세트 수</span>
              <span className="text-2xl font-bold text-black">12세트</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">총 볼륨</span>
              <span className="text-2xl font-bold text-black">2,150kg</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">운동 시간</span>
              <span className="text-2xl font-bold text-black">90분</span>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>오늘의 목표 달성률</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-black h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">빠른 실행</h3>

          <div className="space-y-3">
            <button className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-left flex items-center">
              <span className="text-xl mr-3">⚡</span>
              새 운동 기록하기
            </button>

            <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-left flex items-center">
              <span className="text-xl mr-3">📋</span>
              이전 운동 복사하기
            </button>

            <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-left flex items-center">
              <span className="text-xl mr-3">📊</span>
              운동 통계 보기
            </button>

            <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-left flex items-center">
              <span className="text-xl mr-3">🎯</span>
              운동 계획 세우기
            </button>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">최근 운동 기록</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900">어제 - 상체 운동</span>
              <p className="text-sm text-gray-600">벤치프레스, 덤벨프레스, 풀업</p>
            </div>
            <span className="text-sm text-gray-500">85분</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900">9월 27일 - 하체 운동</span>
              <p className="text-sm text-gray-600">스쿼트, 레그프레스, 런지</p>
            </div>
            <span className="text-sm text-gray-500">75분</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900">9월 25일 - 등 운동</span>
              <p className="text-sm text-gray-600">데드리프트, 바벨로우, 풀다운</p>
            </div>
            <span className="text-sm text-gray-500">90분</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/workouts"
            className="text-black hover:text-gray-700 font-medium text-sm"
          >
            모든 운동 기록 보기 →
          </a>
        </div>
      </div>
    </div>
  );
};