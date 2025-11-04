"use client";

import { Clock, Sparkles, Bell, TrendingUp } from "lucide-react";

export const ComingSoonView = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            준비 중
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          새로운 기능들을 준비하고 있습니다.
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-12">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative">
            <Clock className="w-24 h-24 text-purple-400 dark:text-purple-500 opacity-50" />
            <Sparkles className="w-12 h-12 text-pink-400 dark:text-pink-500 absolute -top-2 -right-2 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              새로운 기능을 준비 중입니다
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              더 나은 사용자 경험을 위해 <br />
              다양한 기능들을 개발하고 있습니다.
            </p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <Bell className="w-6 h-6 text-purple-500 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">운동 알림</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                운동 시간을 알려주는 스마트 알림
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">상세 통계</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                운동 기록 분석 및 진척도 확인
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <Sparkles className="w-6 h-6 text-pink-500 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">AI 추천</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                개인 맞춤형 운동 프로그램 추천
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            새로운 소식은 곧 공지해드리겠습니다!
          </div>
        </div>
      </div>
    </div>
  );
};
