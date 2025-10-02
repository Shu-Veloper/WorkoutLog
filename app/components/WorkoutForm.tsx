"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

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

interface WorkoutFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkoutForm = ({ isOpen, onClose }: WorkoutFormProps) => {
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutDate, setWorkoutDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // 운동 카테고리 옵션
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

  // 운동 단위 옵션
  const units = [
    { value: "weight", label: "중량 운동 (kg × 회)" },
    { value: "bodyweight", label: "체중 운동 (회)" },
    { value: "cardio", label: "유산소 (분)" },
  ];

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      category: "가슴", // 기본값
      unit: "weight", // 기본값
      sets: [
        {
          id: Date.now().toString() + "_1",
          weight: "80",
          reps: "10",
          duration: "",
          distance: "",
          completed: false,
        },
      ],
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const updateExerciseName = (exerciseId: string, name: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, name } : ex))
    );
  };

  const updateExerciseCategory = (exerciseId: string, category: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, category } : ex))
    );
  };

  const updateExerciseUnit = (exerciseId: string, unit: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, unit } : ex))
    );
  };

  // unit에 따른 세트 헤더 라벨 결정
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

  // unit에 따른 placeholder 결정
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

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) =>
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
      )
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((set) => set.id !== setId) }
          : ex
      )
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: keyof WorkoutSet,
    value: string | boolean
  ) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : ex
      )
    );
  };

  const handleSubmit = async () => {
    try {
      // 1. 현재 사용자 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 2. 운동(workout) 생성
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          date: workoutDate,
          title: workoutTitle
        })
        .select()
        .single();

      if (workoutError) {
        console.error('Workout creation error:', workoutError);
        alert("운동 기록 생성에 실패했습니다.");
        return;
      }

      // 3. 각 운동별로 처리
      for (const exercise of exercises) {
        // 3-1. 운동이 exercises 테이블에 있는지 확인
        const { data: existingExercise, error: exerciseSelectError } = await supabase
          .from('exercises')
          .select('id')
          .eq('name', exercise.name)
          .eq('category', exercise.category)
          .eq('unit', exercise.unit)
          .single();

        let exerciseId: string;

        if (exerciseSelectError && exerciseSelectError.code === 'PGRST116') {
          // 운동이 없으면 새로 생성
          const { data: newExercise, error: exerciseInsertError } = await supabase
            .from('exercises')
            .insert({
              name: exercise.name,
              category: exercise.category,
              unit: exercise.unit
            })
            .select('id')
            .single();

          if (exerciseInsertError) {
            console.error('Exercise creation error:', exerciseInsertError);
            alert(`운동 "${exercise.name}" 생성에 실패했습니다.`);
            return;
          }
          exerciseId = newExercise.id;
        } else if (exerciseSelectError) {
          console.error('Exercise lookup error:', exerciseSelectError);
          alert(`운동 "${exercise.name}" 조회에 실패했습니다.`);
          return;
        } else {
          exerciseId = existingExercise!.id;
        }

        // 3-2. 세트 데이터 생성
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
            completed: set.completed
          };

          // unit에 따라 필드 매핑
          if (exercise.unit === "cardio") {
            // 유산소: weight → distance, reps → duration
            setData.distance = set.weight ? parseFloat(set.weight) : null;
            setData.duration = set.reps ? parseInt(set.reps) * 60 : null; // 분을 초로 변환
            setData.weight = null;
            setData.reps = null;
          } else {
            // weight/bodyweight: 그대로 유지
            setData.weight = set.weight ? parseFloat(set.weight) : null;
            setData.reps = set.reps ? parseInt(set.reps) : null;
            setData.duration = null;
            setData.distance = null;
          }

          return setData;
        });

        // 3-3. workout_sets 테이블에 세트 데이터 삽입
        const { error: setsError } = await supabase
          .from('workout_sets')
          .insert(setsToInsert);

        if (setsError) {
          console.error('Sets creation error:', setsError);
          alert(`"${exercise.name}" 세트 기록에 실패했습니다.`);
          return;
        }
      }

      alert("운동 기록이 성공적으로 저장되었습니다!");
      onClose();

    } catch (error) {
      console.error('Unexpected error:', error);
      alert("예상치 못한 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">새 운동 기록</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* 운동 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운동 제목
            </label>
            <input
              type="text"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              placeholder="예: 가슴 운동, 하체 데이"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* 운동 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              운동 날짜
            </label>
            <input
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

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

            {exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>운동 종목을 추가해보세요</p>
              </div>
            ) : (
              <div className="space-y-6">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="border rounded-lg p-4">
                    {/* 운동 이름, 카테고리, 단위 */}
                    <div className="space-y-2 mb-4">
                      <div className="grid grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) =>
                            updateExerciseName(exercise.id, e.target.value)
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
                            updateExerciseCategory(exercise.id, e.target.value)
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
                            updateExerciseUnit(exercise.id, e.target.value)
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

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black text-white hover:bg-gray-800"
            disabled={!workoutTitle || exercises.length === 0}
          >
            운동 기록 저장
          </Button>
        </div>
      </div>
    </div>
  );
};
