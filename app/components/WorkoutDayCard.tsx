"use client";

import { WorkoutDay } from "@/types/workout";
import { Clock, Dumbbell, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface WorkoutDayCardProps {
  workoutDay: WorkoutDay;
  onClose?: () => void;
}

export const WorkoutDayCard = ({ workoutDay, onClose }: WorkoutDayCardProps) => {
  const { t, mounted } = useLocale();

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {new Date(workoutDay.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </h2>
          {workoutDay.totalDurationMin && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>총 운동 시간: {workoutDay.totalDurationMin}분</span>
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* 운동 목록 */}
      <div className="space-y-6">
        {workoutDay.exercises.map((exercise, idx) => (
          <div key={exercise.id} className="border-l-4 border-blue-500 pl-4">
            {/* 운동 이름 및 부위 */}
            <div className="flex items-center gap-3 mb-3">
              <Dumbbell className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t(`exercises.${exercise.exerciseName}`)}
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {t(`bodyParts.${exercise.bodyPart}`)}
              </span>
            </div>

            {/* 세트 정보 */}
            <div className="space-y-2 ml-8">
              {exercise.sets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300 py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="font-medium min-w-[60px]">
                    세트 {set.setOrder}:
                  </span>

                  {/* 무산소 운동 (중량 + 횟수) */}
                  {exercise.type === 'weight' && (
                    <span>
                      {set.weight ? `${set.weight}kg` : '자체체중'} × {set.reps}회
                    </span>
                  )}

                  {/* 유산소 운동 (거리 + 시간 + 속도) */}
                  {exercise.type === 'cardio' && (
                    <span className="flex gap-3">
                      {set.distance && <span>{set.distance}km</span>}
                      {set.timeMin && <span>{set.timeMin}분</span>}
                      {set.speed && <span>{set.speed}km/h</span>}
                    </span>
                  )}

                  {set.completed && (
                    <span className="ml-auto text-green-600 dark:text-green-400 font-medium">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* 운동 메모 */}
            {exercise.note && (
              <div className="ml-8 mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                💡 {exercise.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 전체 메모 */}
      {workoutDay.note && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📝 {workoutDay.note}
          </p>
        </div>
      )}
    </div>
  );
};
