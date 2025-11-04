"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { WorkoutDay } from '@/types/workout';

interface WorkoutContextType {
  workoutDays: WorkoutDay[];
  getWorkoutForDate: (date: string) => WorkoutDay | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({
  children,
  workoutDays
}: {
  children: ReactNode;
  workoutDays: WorkoutDay[];
}) {
  const getWorkoutForDate = (dateStr: string) => {
    return workoutDays.find(workout => workout.date === dateStr);
  };

  return (
    <WorkoutContext.Provider value={{ workoutDays, getWorkoutForDate }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    // Context가 없으면 빈 데이터 반환 (선택적)
    return {
      workoutDays: [],
      getWorkoutForDate: () => undefined
    };
  }
  return context;
}
