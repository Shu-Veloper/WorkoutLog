"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface WorkoutSet {
  id: string;
  weight: string;
  reps: string;
  duration: string;
  distance: string;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  unit: string;
  sets: WorkoutSet[];
}

interface WorkoutData {
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  exercises: Exercise[];
}

export default function RecordPage() {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    date: new Date().toISOString().split("T")[0],
    title: "",
    startTime: "",
    endTime: "",
    exercises: [],
  });

  const [loading, setLoading] = useState(false);

  // 운동 카테고리와 단위 옵션
  const categories = [
    { value: "가슴", label: "가슴" },
    { value: "등", label: "등" },
    { value: "어깨", label: "어깨" },
    { value: "다리", label: "다리" },
    { value: "팔", label: "팔" },
    { value: "복부", label: "복부" },
    { value: "유산소", label: "유산소" },
    { value: "기타", label: "기타" },
  ];

  const units = [
    { value: "weight", label: "중량 운동 (kg × 회)" },
    { value: "bodyweight", label: "체중 운동 (회)" },
    { value: "cardio", label: "유산소 (분)" },
  ];

  // 캐시 키 생성
  const getCacheKey = (date: string) => `workout_cache_${date}`;

  // 오래된 캐시 정리 (1일 이상된 캐시 삭제)
  const cleanOldCache = () => {
    const keys = Object.keys(localStorage);
    const workoutCacheKeys = keys.filter((key) =>
      key.startsWith("workout_cache_")
    );

    workoutCacheKeys.forEach((key) => {
      const date = key.replace("workout_cache_", "");
      const cacheDate = new Date(date);
      const today = new Date();
      const diffTime = today.getTime() - cacheDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 1일 이상된 캐시 삭제
      if (diffDays > 1) {
        localStorage.removeItem(key);
      }
    });
  };

  // 로컬스토리지에서 데이터 로드
  useEffect(() => {
    // 오래된 캐시 정리
    cleanOldCache();

    const cacheKey = getCacheKey(workoutData.date);
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setWorkoutData(parsed);
      } catch (error) {
        console.error("캐시 데이터 파싱 오류:", error);
      }
    }
  }, []);

  // 데이터 변경 시 로컬스토리지에 저장
  useEffect(() => {
    const cacheKey = getCacheKey(workoutData.date);
    localStorage.setItem(cacheKey, JSON.stringify(workoutData));
  }, [workoutData]);

  // 날짜 변경 시 해당 날짜의 캐시 로드
  const handleDateChange = (newDate: string) => {
    // 오래된 캐시 정리
    cleanOldCache();

    const cacheKey = getCacheKey(newDate);
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setWorkoutData(parsed);
      } catch (error) {
        console.error("캐시 데이터 파싱 오류:", error);
        setWorkoutData({
          date: newDate,
          title: "",
          startTime: "",
          endTime: "",
          exercises: [],
        });
      }
    } else {
      setWorkoutData({
        date: newDate,
        title: "",
        startTime: "",
        endTime: "",
        exercises: [],
      });
    }
  };

  // 운동 시간 계산
  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;

    const startDate = new Date(`${workoutData.date}T${start}`);
    const endDate = new Date(`${workoutData.date}T${end}`);

    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  };

  // 헤더와 placeholder 설정
  const getSetHeaders = (unit: string) => {
    switch (unit) {
      case "weight":
        return { first: "중량 (kg)", second: "횟수", showBoth: true };
      case "bodyweight":
        return { first: "횟수", second: "", showBoth: false };
      case "cardio":
        return { first: "시간 (분)", second: "거리 (km)", showBoth: true };
      default:
        return { first: "중량 (kg)", second: "횟수", showBoth: true };
    }
  };

  const getPlaceholders = (unit: string) => {
    switch (unit) {
      case "weight":
        return { first: "80", second: "10" };
      case "bodyweight":
        return { first: "10", second: "" };
      case "cardio":
        return { first: "30", second: "5" };
      default:
        return { first: "80", second: "10" };
    }
  };

  // 운동 추가
  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      category: "가슴",
      unit: "weight",
      sets: [
        {
          id: Date.now().toString() + "_1",
          weight: "",
          reps: "",
          duration: "",
          distance: "",
          completed: false,
        },
      ],
    };
    setWorkoutData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  // 운동 삭제
  const removeExercise = (exerciseId: string) => {
    setWorkoutData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  // 운동 정보 업데이트
  const updateExercise = (
    exerciseId: string,
    field: keyof Exercise,
    value: string
  ) => {
    setWorkoutData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  // 세트 추가
  const addSet = (exerciseId: string) => {
    setWorkoutData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: Date.now().toString(),
                  weight: "",
                  reps: "",
                  duration: "",
                  distance: "",
                  completed: false,
                },
              ],
            }
          : ex
      ),
    }));
  };

  // 세트 삭제
  const removeSet = (exerciseId: string, setId: string) => {
    setWorkoutData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((set) => set.id !== setId) }
          : ex
      ),
    }));
  };

  // 세트 업데이트
  const updateSet = (
    exerciseId: string,
    setId: string,
    field: keyof WorkoutSet,
    value: string | boolean
  ) => {
    setWorkoutData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : ex
      ),
    }));
  };

  // 최종 저장
  const handleSave = async () => {
    if (!workoutData.title || workoutData.exercises.length === 0) {
      alert("운동 제목과 최소 하나의 운동 종목을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // Supabase에 저장하는 로직 (기존 WorkoutForm과 동일)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("로그인이 필요합니다.");
        return;
      }

      const workoutDuration = calculateDuration(
        workoutData.startTime,
        workoutData.endTime
      );
      const { data: workout, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          user_id: user.id,
          date: workoutData.date,
          title: workoutData.title,
          duration: workoutDuration > 0 ? workoutDuration : null,
        })
        .select()
        .single();

      if (workoutError) {
        console.error("Workout creation error:", workoutError);
        alert("운동 기록 생성에 실패했습니다.");
        return;
      }

      // 운동 종목별 저장
      for (const exercise of workoutData.exercises) {
        const { data: existingExercise, error: exerciseSelectError } =
          await supabase
            .from("exercises")
            .select("id")
            .eq("name", exercise.name)
            .eq("category", exercise.category)
            .eq("unit", exercise.unit)
            .single();

        let exerciseId: string;

        if (exerciseSelectError && exerciseSelectError.code === "PGRST116") {
          const { data: newExercise, error: exerciseInsertError } =
            await supabase
              .from("exercises")
              .insert({
                name: exercise.name,
                category: exercise.category,
                unit: exercise.unit,
              })
              .select("id")
              .single();

          if (exerciseInsertError) {
            console.error("Exercise creation error:", exerciseInsertError);
            alert(`운동 "${exercise.name}" 생성에 실패했습니다.`);
            return;
          }
          exerciseId = newExercise.id;
        } else if (exerciseSelectError) {
          console.error("Exercise lookup error:", exerciseSelectError);
          alert(`운동 "${exercise.name}" 조회에 실패했습니다.`);
          return;
        } else {
          exerciseId = existingExercise!.id;
        }

        const setsToInsert = exercise.sets.map((set, index) => {
          const setData: {
            workout_id: string;
            exercise_id: string;
            set_number: number;
            completed: boolean;
            weight?: number | null;
            reps?: number | null;
            duration?: number | null;
            distance?: number | null;
          } = {
            workout_id: workout.id,
            exercise_id: exerciseId,
            set_number: index + 1,
            completed: set.completed,
          };

          if (exercise.unit === "cardio") {
            setData.distance = set.weight ? parseFloat(set.weight) : null;
            setData.duration = set.reps ? parseInt(set.reps) * 60 : null;
            setData.weight = null;
            setData.reps = null;
          } else {
            setData.weight = set.weight ? parseFloat(set.weight) : null;
            setData.reps = set.reps ? parseInt(set.reps) : null;
            setData.duration = null;
            setData.distance = null;
          }

          return setData;
        });

        const { error: setsError } = await supabase
          .from("workout_sets")
          .insert(setsToInsert);

        if (setsError) {
          console.error("Sets creation error:", setsError);
          alert(`"${exercise.name}" 세트 기록에 실패했습니다.`);
          return;
        }
      }

      // 저장 성공 시 캐시 삭제
      const cacheKey = getCacheKey(workoutData.date);
      localStorage.removeItem(cacheKey);

      alert("운동 기록이 성공적으로 저장되었습니다!");

      // 홈으로 이동
      window.location.href = "/";
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("예상치 못한 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              홈으로 돌아가기
            </Link>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "저장 중..." : "기록 저장"}
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">운동 기록하기</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 날짜 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운동 날짜
            </label>
            <input
              type="date"
              value={workoutData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* 운동 제목 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운동 제목
            </label>
            <input
              type="text"
              value={workoutData.title}
              onChange={(e) =>
                setWorkoutData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="예: 가슴 운동, 하체 데이"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* 운동 시간 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작 시간
              </label>
              <input
                type="time"
                value={workoutData.startTime}
                onChange={(e) =>
                  setWorkoutData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료 시간
              </label>
              <input
                type="time"
                value={workoutData.endTime}
                onChange={(e) =>
                  setWorkoutData((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* 운동 시간 표시 */}
          {workoutData.startTime && workoutData.endTime && (
            <div className="bg-gray-50 p-3 rounded-md mb-6">
              <span className="text-sm text-gray-600">
                총 운동 시간:{" "}
                <span className="font-medium text-gray-800">
                  {calculateDuration(
                    workoutData.startTime,
                    workoutData.endTime
                  )}
                  분
                </span>
              </span>
            </div>
          )}

          {/* 운동 종목들 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                운동 종목
              </label>
              <Button
                onClick={addExercise}
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                운동 추가
              </Button>
            </div>

            {workoutData.exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>운동 종목을 추가해보세요</p>
              </div>
            ) : (
              <div className="space-y-6">
                {workoutData.exercises.map((exercise) => (
                  <div key={exercise.id} className="border rounded-lg p-4">
                    {/* 운동 이름, 카테고리, 단위 */}
                    <div className="space-y-2 mb-4">
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) =>
                            updateExercise(exercise.id, "name", e.target.value)
                          }
                          placeholder="운동 이름 (예: 벤치프레스)"
                          className="col-span-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(exercise.id)}
                          className="col-span-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={exercise.category}
                          onChange={(e) =>
                            updateExercise(
                              exercise.id,
                              "category",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={exercise.unit}
                          onChange={(e) =>
                            updateExercise(exercise.id, "unit", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          {units.map((unit) => (
                            <option key={unit.value} value={unit.value}>
                              {unit.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 세트들 */}
                    <div className="space-y-2">
                      {getSetHeaders(exercise.unit).showBoth ? (
                        <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700">
                          <div>세트</div>
                          <div>{getSetHeaders(exercise.unit).first}</div>
                          <div>{getSetHeaders(exercise.unit).second}</div>
                          <div>완료</div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-700">
                          <div>세트</div>
                          <div>{getSetHeaders(exercise.unit).first}</div>
                          <div>완료</div>
                        </div>
                      )}

                      {exercise.sets.map((set, setIndex) =>
                        getSetHeaders(exercise.unit).showBoth ? (
                          <div
                            key={set.id}
                            className="grid grid-cols-4 gap-2 items-center"
                          >
                            <div className="text-sm text-gray-600">
                              {setIndex + 1}
                            </div>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) =>
                                updateSet(
                                  exercise.id,
                                  set.id,
                                  "weight",
                                  e.target.value
                                )
                              }
                              placeholder={getPlaceholders(exercise.unit).first}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) =>
                                updateSet(
                                  exercise.id,
                                  set.id,
                                  "reps",
                                  e.target.value
                                )
                              }
                              placeholder={
                                getPlaceholders(exercise.unit).second
                              }
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={set.completed}
                                onChange={(e) =>
                                  updateSet(
                                    exercise.id,
                                    set.id,
                                    "completed",
                                    e.target.checked
                                  )
                                }
                                className="rounded"
                              />
                              {exercise.sets.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSet(exercise.id, set.id)}
                                  className="h-6 w-6 text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            key={set.id}
                            className="grid grid-cols-3 gap-2 items-center"
                          >
                            <div className="text-sm text-gray-600">
                              {setIndex + 1}
                            </div>
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) =>
                                updateSet(
                                  exercise.id,
                                  set.id,
                                  "reps",
                                  e.target.value
                                )
                              }
                              placeholder={getPlaceholders(exercise.unit).first}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={set.completed}
                                onChange={(e) =>
                                  updateSet(
                                    exercise.id,
                                    set.id,
                                    "completed",
                                    e.target.checked
                                  )
                                }
                                className="rounded"
                              />
                              {exercise.sets.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSet(exercise.id, set.id)}
                                  className="h-6 w-6 text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      )}

                      <Button
                        onClick={() => addSet(exercise.id)}
                        variant="ghost"
                        size="sm"
                        className="w-full text-gray-600 hover:text-gray-800"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        세트 추가
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
