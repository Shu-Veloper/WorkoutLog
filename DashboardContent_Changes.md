# DashboardContent 타입 에러 해결 변경사항

## 개요
DashboardContent 컴포넌트에서 Supabase 타입 충돌 에러를 해결하기 위해 컴포넌트별 전용 타입을 정의하고 로직을 수정했습니다.

## 주요 변경사항

### 1. 타입 정의 변경

#### 이전 (에러 발생)
```typescript
import type {
  RecentWorkout,
  TodayStats,
  SupabaseWorkoutWithSets,
  SupabaseWorkoutSetWithExercise,
  SupabaseWorkoutSetForStats,
  DateString,
} from "@/types/workout";
```

#### 이후 (해결)
```typescript
import type {
  RecentWorkout,
  TodayStats,
  DateString,
} from "@/types/workout";

// DashboardContent 전용 타입들
interface DashboardExerciseInfo {
  name: string;
}

interface DashboardWorkoutSet {
  exercises: DashboardExerciseInfo[];
}

interface DashboardWorkout {
  id: string;
  date: string;
  title: string;
  duration: number | null;
  workout_sets: DashboardWorkoutSet[];
}

// 통계용 타입들
interface DashboardExerciseWithUnit {
  unit: string;
}

interface DashboardStatsSet {
  weight: number | null;
  reps: number | null;
  completed: boolean;
  exercises: DashboardExerciseWithUnit[];
}
```

### 2. fetchRecentWorkouts 함수 변경

#### 이전 (에러 발생)
```typescript
const workoutsWithExercises =
  (data as SupabaseWorkoutWithSets[])?.map((workout) => {
    const exerciseNames =
      workout.workout_sets
        ?.map(
          (set: SupabaseWorkoutSetWithExercise) => set.exercises?.name
        )
        .filter((name: string): name is string => Boolean(name))
        .filter(
          (name: string, index: number, arr: string[]) =>
            arr.indexOf(name) === index
        ) || [];
```

**문제점:**
- `SupabaseWorkoutSetWithExercise` 타입에서 `exercises`가 단일 객체로 정의되었지만, 실제 Supabase 응답은 배열
- `set.exercises?.name` 접근이 불가능 (exercises가 배열이므로)

#### 이후 (해결)
```typescript
const workoutsWithExercises =
  (data as DashboardWorkout[])?.map((workout) => {
    const exerciseNames =
      workout.workout_sets
        ?.flatMap((set: DashboardWorkoutSet) =>
          set.exercises?.map((exercise) => exercise.name) || []
        )
        .filter((name): name is string => Boolean(name))
        .filter(
          (name: string, index: number, arr: string[]) =>
            arr.indexOf(name) === index
        ) || [];
```

**해결사항:**
- `DashboardWorkout` 타입 사용으로 실제 응답 구조와 일치
- `flatMap`을 사용하여 중첩된 exercises 배열을 올바르게 처리
- `exercise.name` 접근 방식으로 변경

### 3. fetchTodayStats 함수 변경

#### 이전 (에러 발생)
```typescript
(setsData as SupabaseWorkoutSetForStats[]).forEach(
  (set: SupabaseWorkoutSetForStats) => {
    if (set.completed) {
      totalSets++;

      if (
        set.exercises?.unit === "weight" &&
        set.weight &&
        set.reps
      ) {
        totalVolume += set.weight * set.reps;
      }
    }
  }
);
```

**문제점:**
- `SupabaseWorkoutSetForStats`에서 `exercises`가 단일 객체로 정의되었지만, 실제 응답은 배열
- `set.exercises?.unit` 접근이 불가능

#### 이후 (해결)
```typescript
(setsData as DashboardStatsSet[]).forEach((set) => {
  if (set.completed) {
    totalSets++;

    if (
      set.exercises?.[0]?.unit === "weight" &&
      set.weight &&
      set.reps
    ) {
      totalVolume += set.weight * set.reps;
    }
  }
});
```

**해결사항:**
- `DashboardStatsSet` 타입 사용으로 실제 응답 구조와 일치
- `set.exercises?.[0]?.unit`으로 배열의 첫 번째 요소에 접근

## 핵심 차이점 요약

| 구분 | 이전 | 이후 | 변경 이유 |
|------|------|------|-----------|
| **타입 정의** | 글로벌 Supabase 타입 사용 | 컴포넌트별 전용 타입 정의 | 실제 응답 구조와 불일치 해결 |
| **exercises 구조** | 단일 객체로 가정 | 배열로 정의 | Supabase 실제 응답 구조 반영 |
| **Recent Workouts** | `set.exercises?.name` | `exercise.name` with flatMap | 배열 구조 처리 |
| **Today Stats** | `set.exercises?.unit` | `set.exercises?.[0]?.unit` | 배열 첫 번째 요소 접근 |
| **타입 안전성** | 런타임 에러 발생 | 컴파일 타임 타입 체크 통과 | 타입 정합성 확보 |

## 추가된 디버깅 로그

```typescript
// Recent Workouts
console.log("@@@ Recent workouts data:", data);
console.log("@@@ First workout structure:", data?.[0]);
console.log("@@@ First workout_set structure:", data?.[0]?.workout_sets?.[0]);

// Today Stats
console.log("Today sets data:", setsData);
console.log("First set structure:", setsData?.[0]);
console.log("First set exercises structure:", setsData?.[0]?.exercises);
```

이러한 로그를 통해 실제 Supabase 응답 구조를 확인하고 타입을 올바르게 정의할 수 있었습니다.