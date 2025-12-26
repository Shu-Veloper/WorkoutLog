// 운동 부위 타입
export type BodyPart = 'back' | 'shoulder' | 'abs' | 'biceps' | 'triceps' | 'chest' | 'legs' | 'cardio';

// 운동 타입 (무산소 vs 유산소)
export type ExerciseType = 'weight' | 'cardio';

// 세트 기록
export interface SetRecord {
  id: string;
  setOrder: number;
  weight?: number; // kg
  reps?: number; // 횟수
  timeMin?: number; // 시간 (분)
  distance?: number; // 거리 (km)
  speed?: number; // 속도 (km/h)
  completed: boolean;
}

// 운동 기록 (예: 풀업 3세트)
export interface ExerciseRecord {
  id: string;
  exerciseName: string; // 운동 이름
  bodyPart: BodyPart;
  type: ExerciseType;
  sets: SetRecord[];
  note?: string;
}

// 운동한 날 (하루 전체 운동)
export interface WorkoutDay {
  id: string;
  date: string; // YYYY-MM-DD
  exercises: ExerciseRecord[];
  totalDurationMin?: number; // 총 운동 시간
  note?: string;
}

// 통계 데이터
export interface WorkoutStats {
  totalWorkoutDays: number;
  bodyPartDistribution: Record<BodyPart, number>; // 부위별 운동 횟수
  totalWeight: number; // 총 중량 (kg)
  totalSets: number; // 총 세트 수
  topExercises: { name: string; count: number }[]; // 가장 많이 한 운동
  streak: number; // 연속 운동 일수
}

// 영양소 데이터 (추후 구현 예정)
export interface NutritionData {
  calories: { goal: number; current: number };
  protein: { goal: number; current: number };
  carbs: { goal: number; current: number };
}
