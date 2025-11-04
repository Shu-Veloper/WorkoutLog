"use client";

import { useState, useEffect } from "react";
import { BodyPart, ExerciseRecord, SetRecord } from "@/types/workout";
import { bodyPartNames, exercisesByBodyPart } from "@/data/mockWorkouts";
import { Plus, Trash2, Save, Clock } from "lucide-react";

export const RecordingView = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | "">("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [currentSets, setCurrentSets] = useState<Omit<SetRecord, 'id'>[]>([]);
  const [savedExercises, setSavedExercises] = useState<ExerciseRecord[]>([]);

  // 타이머 상태
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 세트 추가
  const addSet = () => {
    const newSet: Omit<SetRecord, 'id'> = {
      setOrder: currentSets.length + 1,
      weight: 0,
      reps: 0,
      completed: true,
    };
    setCurrentSets([...currentSets, newSet]);
  };

  // 세트 삭제
  const removeSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  // 세트 정보 업데이트
  const updateSet = (index: number, field: keyof SetRecord, value: number | boolean) => {
    const updated = [...currentSets];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentSets(updated);
  };

  // 운동 저장
  const saveExercise = () => {
    if (!selectedBodyPart || !selectedExercise || currentSets.length === 0) {
      alert("운동 부위, 종목, 세트를 모두 입력해주세요.");
      return;
    }

    const newExercise: ExerciseRecord = {
      id: `ex-${Date.now()}`,
      exerciseName: selectedExercise,
      bodyPart: selectedBodyPart as BodyPart,
      type: selectedBodyPart === 'cardio' ? 'cardio' : 'weight',
      sets: currentSets.map((set, idx) => ({
        ...set,
        id: `set-${Date.now()}-${idx}`,
      })),
    };

    setSavedExercises([...savedExercises, newExercise]);

    // 입력 폼 초기화
    setSelectedExercise("");
    setCurrentSets([]);
  };

  // 전체 완료
  const completeWorkout = () => {
    console.log("운동 완료!", savedExercises);
    alert(`${savedExercises.length}개의 운동이 저장되었습니다!`);
  };

  const today = mounted ? new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }) : '';

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 헤더 - 날짜 및 타이머 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              운동 기록
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{today}</p>
          </div>

          {/* 휴식 타이머 */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">휴식 타이머</div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
              </div>
              <button
                onClick={() => {
                  setRestTimer(90);
                  setIsTimerRunning(!isTimerRunning);
                }}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              >
                <Clock className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 운동 입력 폼 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          운동 추가
        </h2>

        {/* Step 1: 운동 부위 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Step 1: 운동 부위 선택
          </label>
          <select
            value={selectedBodyPart}
            onChange={(e) => {
              setSelectedBodyPart(e.target.value as BodyPart);
              setSelectedExercise("");
              setCurrentSets([]);
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          >
            <option value="">운동 부위를 선택하세요</option>
            {Object.entries(bodyPartNames).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: 운동 종목 선택 */}
        {selectedBodyPart && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Step 2: 운동 종목 선택
            </label>
            <select
              value={selectedExercise}
              onChange={(e) => {
                setSelectedExercise(e.target.value);
                // 첫 세트 자동 추가
                if (e.target.value && currentSets.length === 0) {
                  addSet();
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            >
              <option value="">운동을 선택하세요</option>
              {exercisesByBodyPart[selectedBodyPart as BodyPart]?.map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Step 3: 세트 입력 */}
        {selectedExercise && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Step 3: 세트 정보 입력
            </label>
            <div className="space-y-3">
              {currentSets.map((set, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">
                    세트 {set.setOrder}:
                  </span>

                  {/* 무산소 운동 입력 */}
                  {selectedBodyPart !== 'cardio' && (
                    <>
                      <input
                        type="number"
                        placeholder="중량(kg)"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(index, 'weight', Number(e.target.value))}
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">kg ×</span>
                      <input
                        type="number"
                        placeholder="횟수"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(index, 'reps', Number(e.target.value))}
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">회</span>
                    </>
                  )}

                  {/* 유산소 운동 입력 */}
                  {selectedBodyPart === 'cardio' && (
                    <>
                      <input
                        type="number"
                        placeholder="거리(km)"
                        value={set.distance || ''}
                        onChange={(e) => updateSet(index, 'distance', Number(e.target.value))}
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">km</span>
                      <input
                        type="number"
                        placeholder="시간(분)"
                        value={set.timeMin || ''}
                        onChange={(e) => updateSet(index, 'timeMin', Number(e.target.value))}
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">분</span>
                    </>
                  )}

                  {/* 삭제 버튼 */}
                  {index > 0 && (
                    <button
                      onClick={() => removeSet(index)}
                      className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              {/* 세트 추가 버튼 */}
              <button
                onClick={addSet}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
                세트 추가
              </button>
            </div>
          </div>
        )}

        {/* 저장 버튼 */}
        {currentSets.length > 0 && (
          <button
            onClick={saveExercise}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            운동 저장
          </button>
        )}
      </div>

      {/* 저장된 운동 목록 */}
      {savedExercises.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            오늘 기록한 운동 ({savedExercises.length})
          </h2>

          <div className="space-y-4">
            {savedExercises.map((exercise) => (
              <div key={exercise.id} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {exercise.exerciseName}
                  </h3>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {bodyPartNames[exercise.bodyPart]}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.sets.length} 세트 완료
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={completeWorkout}
            className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg transition-colors"
          >
            운동 완료!
          </button>
        </div>
      )}
    </div>
  );
};
