"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { TargetCaloriesView } from "./TargetCaloriesView";
import { FoodCaloriesView } from "./FoodCaloriesView";
import { useLocale } from "@/contexts/LocaleContext";

export const NutritionView = () => {
  const [mounted, setMounted] = useState(false);
  const [isCalorieCalculator, setIsCalorieCalculator] = useState(false);
  const { t, mounted: localeReady } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !localeReady) {
    return (
      <div className="space-y-8">
        {/* Loading state - static placeholder */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-md">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 dark:text-gray-400">読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Switch between Target Calories and Food Calculator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-md">
          <span
            className={`text-xs md:text-sm font-semibold transition-colors ${
              !isCalorieCalculator
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("nutrition.targetCalories")}
          </span>
          <Switch
            checked={isCalorieCalculator}
            onCheckedChange={setIsCalorieCalculator}
          />
          <span
            className={`text-xs md:text-sm font-semibold transition-colors ${
              isCalorieCalculator
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("nutrition.calorieCalculator")}
          </span>
        </div>
      </div>

      {/* Content */}
      {isCalorieCalculator ? <FoodCaloriesView /> : <TargetCaloriesView />}
    </div>
  );
};
