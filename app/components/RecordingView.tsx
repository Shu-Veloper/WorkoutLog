"use client";

import { useState, useEffect } from "react";
import { BodyPart, ExerciseRecord, SetRecord } from "@/types/workout";
import { bodyPartNames, exercisesByBodyPart } from "@/data/mockWorkouts";
import { Plus, Trash2, Save } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export const RecordingView = () => {
  const { t, locale, mounted: localeReady } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | "">("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [currentSets, setCurrentSets] = useState<Omit<SetRecord, "id">[]>([]);
  const [savedExercises, setSavedExercises] = useState<ExerciseRecord[]>([]);

  // 타이머 상태
  const [restTimer, setRestTimer] = useState(90);
  const [initialTime, setInitialTime] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);

  useEffect(() => {
    setSelectedDate(new Date());
    setMounted(true);
  }, []);

  // 타이머 카운트다운
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, restTimer]);

  // 세트 추가
  const addSet = () => {
    const newSet: Omit<SetRecord, "id"> = {
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
  const updateSet = (
    index: number,
    field: keyof SetRecord,
    value: number | boolean
  ) => {
    const updated = [...currentSets];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentSets(updated);
  };

  // 운동 저장
  const saveExercise = () => {
    if (!selectedBodyPart || !selectedExercise || currentSets.length === 0) {
      alert(t("recording.alert.fillAll"));
      return;
    }

    const newExercise: ExerciseRecord = {
      id: `ex-${Date.now()}`,
      exerciseName: selectedExercise,
      bodyPart: selectedBodyPart as BodyPart,
      type: selectedBodyPart === "cardio" ? "cardio" : "weight",
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
    alert(`${savedExercises.length}${t("recording.alert.saved")}`);
  };

  const formatDate = (date: Date) => {
    if (!mounted) return "";
    const localeMap = {
      ja: "ja-JP",
      en: "en-US",
      ko: "ko-KR",
    };
    return date.toLocaleDateString(localeMap[locale], {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatDateToString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  if (!mounted || !localeReady) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 dark:text-gray-400">
              読み込み中...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-0 sm:p-6 space-y-4 sm:space-y-8">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 sm:rounded-lg sm:shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 hidden sm:block">
          {t("recording.title")}
        </h1>

        {/* 휴식 타이머 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center gap-6">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {t("recording.restTimer")}
            </div>

            {/* 원형 타이머 */}
            <div className="relative w-64 h-64">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 200 200"
              >
                {/* 배경 원 */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />

                {/* 프로그레스 원 */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 90 * (1 - restTimer / initialTime)
                  }`}
                  className="transition-all duration-300"
                />
              </svg>

              {/* 중앙 시간 표시 */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isEditingTime ? (
                  <input
                    type="number"
                    value={restTimer}
                    onChange={(e) => {
                      const value = Math.max(0, parseInt(e.target.value) || 0);
                      setRestTimer(value);
                      setInitialTime(value);
                    }}
                    onBlur={() => setIsEditingTime(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsEditingTime(false);
                      }
                    }}
                    autoFocus
                    className="w-24 text-4xl font-bold text-center bg-transparent border-2 border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-emerald-600 dark:text-emerald-400"
                  />
                ) : (
                  <button
                    onClick={() => !isTimerRunning && setIsEditingTime(true)}
                    disabled={isTimerRunning}
                    className={`text-6xl font-bold tabular-nums ${
                      isTimerRunning
                        ? "text-emerald-600 dark:text-emerald-400 cursor-default"
                        : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                    }`}
                  >
                    {restTimer}
                    <span className="text-3xl ml-1">s</span>
                  </button>
                )}
              </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                disabled={restTimer === 0}
                className={`px-10 py-4 sm:px-8 sm:py-3 font-semibold rounded-lg transition-colors text-base sm:text-sm ${
                  isTimerRunning
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                }`}
              >
                {isTimerRunning
                  ? t("recording.pause") || "일시정지"
                  : t("recording.start") || "시작"}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setRestTimer(initialTime);
                }}
                className="px-10 py-4 sm:px-8 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-base sm:text-sm"
              >
                {t("recording.reset") || "리셋"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 운동 입력 폼 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("recording.addExercise")}
        </h2>

        {/* 날짜 선택 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t("recording.selectDate")}
          </label>
          {mounted && selectedDate && (
            <>
              <input
                type="date"
                value={formatDateToString(selectedDate)}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(new Date(e.target.value));
                  }
                }}
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 dark:bg-gray-800/50 dark:text-white"
              />
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium text-center mt-2">
                {formatDate(selectedDate)}
              </div>
            </>
          )}
          {(!mounted || !selectedDate) && (
            <div className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-center">
              ...
            </div>
          )}
        </div>

        {/* Step 1: 운동 부위 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("recording.step1")}
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
            <option value="">{t("recording.selectBodyPart")}</option>
            {Object.entries(bodyPartNames).map(([key]) => (
              <option key={key} value={key}>
                {t(`bodyParts.${key}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: 운동 종목 선택 */}
        {selectedBodyPart && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("recording.step2")}
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
              <option value="">{t("recording.selectExercise")}</option>
              {exercisesByBodyPart[selectedBodyPart as BodyPart]?.map(
                (exercise) => (
                  <option key={exercise} value={exercise}>
                    {t(`exercises.${exercise}`)}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* Step 3: 세트 입력 */}
        {selectedExercise && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("recording.step3")}
            </label>
            <div className="space-y-3">
              {currentSets.map((set, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">
                    {t("recording.set")} {set.setOrder}:
                  </span>

                  {/* 무산소 운동 입력 */}
                  {selectedBodyPart !== "cardio" && (
                    <>
                      <input
                        type="number"
                        placeholder={t("recording.weight")}
                        value={set.weight || ""}
                        onChange={(e) =>
                          updateSet(index, "weight", Number(e.target.value))
                        }
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">
                        kg ×
                      </span>
                      <input
                        type="number"
                        placeholder={t("recording.reps")}
                        value={set.reps || ""}
                        onChange={(e) =>
                          updateSet(index, "reps", Number(e.target.value))
                        }
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">
                        {t("recording.reps")}
                      </span>
                    </>
                  )}

                  {/* 유산소 운동 입력 */}
                  {selectedBodyPart === "cardio" && (
                    <>
                      <input
                        type="number"
                        placeholder={t("recording.distance")}
                        value={set.distance || ""}
                        onChange={(e) =>
                          updateSet(index, "distance", Number(e.target.value))
                        }
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">
                        km
                      </span>
                      <input
                        type="number"
                        placeholder={t("recording.time")}
                        value={set.timeMin || ""}
                        onChange={(e) =>
                          updateSet(index, "timeMin", Number(e.target.value))
                        }
                        className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      />
                      <span className="text-gray-500 dark:text-gray-400">
                        {t("recording.time")}
                      </span>
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
                {t("recording.addSet")}
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
            {t("recording.saveExercise")}
          </button>
        )}
      </div>

      {/* 저장된 운동 목록 */}
      {savedExercises.length > 0 && selectedDate && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("recording.todayWorkouts")} ({savedExercises.length})
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {formatDate(selectedDate)}
            </div>
          </div>

          <div className="space-y-4">
            {savedExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="border-l-4 border-green-500 pl-4 py-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t(`exercises.${exercise.exerciseName}`)}
                  </h3>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {t(`bodyParts.${exercise.bodyPart}`)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.sets.length} {t("recording.setsCompleted")}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={completeWorkout}
            className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg transition-colors"
          >
            {t("recording.completeWorkout")}
          </button>
        </div>
      )}
    </div>
  );
};
