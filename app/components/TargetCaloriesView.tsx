"use client";

import { useState } from "react";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";

type GoalType = "maintenance" | "bulk" | "cut";

export const TargetCaloriesView = () => {
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [activityLevel, setActivityLevel] = useState<number>(1.55);
  const [goal, setGoal] = useState<GoalType>("maintenance");
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);

  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateTDEE = () => {
    const bmr = calculateBMR();
    return bmr * activityLevel;
  };

  const calculateTargetCalories = () => {
    const tdee = calculateTDEE();

    switch (goal) {
      case "bulk":
        return Math.round(tdee + 300); // +300 칼로리 for 린매스업/벌크업
      case "cut":
        return Math.round(tdee - 500); // -500 칼로리 for 다이어트
      case "maintenance":
      default:
        return Math.round(tdee);
    }
  };

  const handleCalculate = () => {
    setCalculatedCalories(calculateTargetCalories());
  };

  const goalOptions = [
    { value: "maintenance" as GoalType, label: "체중 유지", icon: Minus, color: "bg-blue-500" },
    { value: "bulk" as GoalType, label: "린매스업/벌크업", icon: TrendingUp, color: "bg-green-500" },
    { value: "cut" as GoalType, label: "다이어트", icon: TrendingDown, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-7 h-7 text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            필요한 칼로리 계산기
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          목표에 맞는 하루 필요 칼로리를 계산해보세요
        </p>
      </div>

      {/* Calculator Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            성별
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                gender === "male"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                gender === "female"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            나이 (세)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            min="10"
            max="100"
          />
        </div>

        {/* Weight & Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              체중 (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="30"
              max="200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              키 (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="100"
              max="250"
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            활동 수준
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value={1.2}>거의 활동 없음 (주 0-1회 운동)</option>
            <option value={1.375}>가벼운 활동 (주 1-3회 운동)</option>
            <option value={1.55}>보통 활동 (주 3-5회 운동)</option>
            <option value={1.725}>활발한 활동 (주 6-7회 운동)</option>
            <option value={1.9}>매우 활발한 활동 (하루 2회 운동)</option>
          </select>
        </div>

        {/* Goal Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            목표
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {goalOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setGoal(option.value)}
                  className={`flex flex-col items-center gap-2 py-4 px-3 rounded-lg border-2 transition-all ${
                    goal === option.value
                      ? `${option.color} text-white border-transparent`
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors"
        >
          계산하기
        </button>

        {/* Result */}
        {calculatedCalories !== null && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-green-200 dark:border-green-700">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {goal === "maintenance" && "체중 유지를 위한"}
                {goal === "bulk" && "린매스업/벌크업을 위한"}
                {goal === "cut" && "다이어트를 위한"}
              </p>
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                {calculatedCalories.toLocaleString()}
              </div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                kcal / 일
              </p>
              <div className="pt-4 border-t border-green-200 dark:border-green-700 mt-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  기초대사량(BMR): {Math.round(calculateBMR()).toLocaleString()} kcal<br />
                  총 에너지 소비량(TDEE): {Math.round(calculateTDEE()).toLocaleString()} kcal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
