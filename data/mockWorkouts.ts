import { WorkoutDay, WorkoutStats, BodyPart } from '@/types/workout';

// 목 운동 데이터
export const mockWorkoutDays: WorkoutDay[] = [
  {
    id: '1',
    date: '2025-01-15',
    totalDurationMin: 90,
    exercises: [
      {
        id: 'ex1',
        exerciseName: '풀업',
        bodyPart: 'back',
        type: 'weight',
        sets: [
          { id: 's1', setOrder: 1, weight: 0, reps: 10, completed: true },
          { id: 's2', setOrder: 2, weight: 0, reps: 8, completed: true },
          { id: 's3', setOrder: 3, weight: 0, reps: 6, completed: true },
        ],
      },
      {
        id: 'ex2',
        exerciseName: '바벨로우',
        bodyPart: 'back',
        type: 'weight',
        sets: [
          { id: 's4', setOrder: 1, weight: 100, reps: 12, completed: true },
          { id: 's5', setOrder: 2, weight: 100, reps: 10, completed: true },
        ],
      },
      {
        id: 'ex3',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        type: 'weight',
        sets: [
          { id: 's6', setOrder: 1, weight: 100, reps: 10, completed: true },
          { id: 's7', setOrder: 2, weight: 100, reps: 8, completed: true },
          { id: 's8', setOrder: 3, weight: 100, reps: 6, completed: true },
        ],
      },
    ],
    note: '오늘은 컨디션이 좋았다!',
  },
  {
    id: '2',
    date: '2025-01-17',
    totalDurationMin: 75,
    exercises: [
      {
        id: 'ex4',
        exerciseName: '오버헤드 프레스',
        bodyPart: 'shoulder',
        type: 'weight',
        sets: [
          { id: 's9', setOrder: 1, weight: 60, reps: 12, completed: true },
          { id: 's10', setOrder: 2, weight: 60, reps: 10, completed: true },
          { id: 's11', setOrder: 3, weight: 60, reps: 8, completed: true },
        ],
      },
      {
        id: 'ex5',
        exerciseName: '사이드 레터럴 레이즈',
        bodyPart: 'shoulder',
        type: 'weight',
        sets: [
          { id: 's12', setOrder: 1, weight: 10, reps: 15, completed: true },
          { id: 's13', setOrder: 2, weight: 10, reps: 15, completed: true },
          { id: 's14', setOrder: 3, weight: 10, reps: 12, completed: true },
        ],
      },
    ],
  },
  {
    id: '3',
    date: '2025-01-20',
    totalDurationMin: 60,
    exercises: [
      {
        id: 'ex6',
        exerciseName: '스쿼트',
        bodyPart: 'legs',
        type: 'weight',
        sets: [
          { id: 's15', setOrder: 1, weight: 120, reps: 10, completed: true },
          { id: 's16', setOrder: 2, weight: 120, reps: 8, completed: true },
          { id: 's17', setOrder: 3, weight: 120, reps: 6, completed: true },
        ],
      },
      {
        id: 'ex7',
        exerciseName: '레그 프레스',
        bodyPart: 'legs',
        type: 'weight',
        sets: [
          { id: 's18', setOrder: 1, weight: 200, reps: 12, completed: true },
          { id: 's19', setOrder: 2, weight: 200, reps: 10, completed: true },
        ],
      },
    ],
  },
  {
    id: '4',
    date: '2025-01-22',
    totalDurationMin: 45,
    exercises: [
      {
        id: 'ex8',
        exerciseName: '바벨 컬',
        bodyPart: 'biceps',
        type: 'weight',
        sets: [
          { id: 's20', setOrder: 1, weight: 40, reps: 12, completed: true },
          { id: 's21', setOrder: 2, weight: 40, reps: 10, completed: true },
          { id: 's22', setOrder: 3, weight: 40, reps: 8, completed: true },
        ],
      },
      {
        id: 'ex9',
        exerciseName: '트라이셉스 익스텐션',
        bodyPart: 'triceps',
        type: 'weight',
        sets: [
          { id: 's23', setOrder: 1, weight: 30, reps: 15, completed: true },
          { id: 's24', setOrder: 2, weight: 30, reps: 12, completed: true },
          { id: 's25', setOrder: 3, weight: 30, reps: 10, completed: true },
        ],
      },
    ],
  },
  {
    id: '5',
    date: '2025-01-25',
    totalDurationMin: 30,
    exercises: [
      {
        id: 'ex10',
        exerciseName: '러닝',
        bodyPart: 'cardio',
        type: 'cardio',
        sets: [
          { id: 's26', setOrder: 1, distance: 5, timeMin: 30, speed: 10, completed: true },
        ],
      },
    ],
  },
];

// 목 통계 데이터
export const mockStats: WorkoutStats = {
  totalWorkoutDays: 15,
  bodyPartDistribution: {
    back: 25,
    shoulder: 15,
    chest: 20,
    biceps: 10,
    triceps: 15,
    legs: 10,
    abs: 5,
    cardio: 10,
  },
  totalWeight: 45000,
  totalSets: 180,
  topExercises: [
    { name: '풀업', count: 18 },
    { name: '벤치프레스', count: 15 },
    { name: '스쿼트', count: 12 },
  ],
  streak: 7,
};

// 운동 부위 한글 이름 매핑
export const bodyPartNames: Record<BodyPart, string> = {
  back: '등',
  shoulder: '어깨',
  abs: '복근',
  biceps: '이두',
  triceps: '삼두',
  chest: '가슴',
  legs: '다리',
  cardio: '유산소',
};

// 부위별 운동 목록 (영문 키 - 번역은 messages/exercises에서)
export const exercisesByBodyPart: Record<BodyPart, string[]> = {
  back: ['pullUp', 'latPullDown', 'barbellRow', 'dumbbellRow', 'seatedRow'],
  shoulder: ['overheadPress', 'sideLateralRaise', 'frontRaise', 'rearDeltFly'],
  chest: ['benchPress', 'inclineBenchPress', 'dumbbellFly', 'pushUp', 'chestPress'],
  biceps: ['barbellCurl', 'dumbbellCurl', 'hammerCurl', 'preacherCurl'],
  triceps: ['tricepsExtension', 'closeGripBenchPress', 'dips', 'cablePushdown'],
  legs: ['squat', 'legPress', 'lunge', 'legCurl', 'legExtension'],
  abs: ['crunch', 'plank', 'legRaise', 'russianTwist'],
  cardio: ['running', 'cycling', 'rowing', 'burpee', 'jumpingJack'],
};
