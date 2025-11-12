"use client";

import { useState } from "react";
import { Apple, Plus, Trash2, Calculator } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  amount: number;
}

export const FoodCaloriesView = () => {
  const { t } = useLocale();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [amount, setAmount] = useState<number>(100);

  const addFoodItem = () => {
    if (!foodName || calories <= 0) {
      alert(t("nutrition.alert.fillRequired"));
      return;
    }

    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: foodName,
      calories,
      carbs,
      protein,
      fat,
      amount,
    };

    setFoodItems([...foodItems, newItem]);

    // Reset form
    setFoodName("");
    setCalories(0);
    setCarbs(0);
    setProtein(0);
    setFat(0);
    setAmount(100);
  };

  const removeFoodItem = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = foodItems.reduce((sum, item) => sum + item.fat, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-2">
          <Apple className="w-7 h-7 text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("nutrition.foodCaloriesTitle")}
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("nutrition.foodCaloriesDesc")}
        </p>
      </div>

      {/* Food Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("nutrition.addFood")}
        </h3>

        {/* Food Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("nutrition.foodName")}
          </label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder={t("nutrition.foodNamePlaceholder")}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Amount and Calories */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("nutrition.amount")}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("nutrition.calories")}
            </label>
            <input
              type="number"
              value={calories || ""}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="0"
            />
          </div>
        </div>

        {/* Macronutrients */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("nutrition.carbs")}
            </label>
            <input
              type="number"
              value={carbs || ""}
              onChange={(e) => setCarbs(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("nutrition.protein")}
            </label>
            <input
              type="number"
              value={protein || ""}
              onChange={(e) => setProtein(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("nutrition.fat")}
            </label>
            <input
              type="number"
              value={fat || ""}
              onChange={(e) => setFat(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              min="0"
            />
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={addFoodItem}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t("nutrition.addButton")}
        </button>
      </div>

      {/* Food List */}
      {foodItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("nutrition.todayFood")} ({foodItems.length})
          </h3>

          <div className="space-y-3">
            {foodItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.amount}g
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{item.calories} kcal</span>
                    {item.carbs > 0 && <span>탄 {item.carbs}g</span>}
                    {item.protein > 0 && <span>단 {item.protein}g</span>}
                    {item.fat > 0 && <span>지 {item.fat}g</span>}
                  </div>
                </div>
                <button
                  onClick={() => removeFoodItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("nutrition.totalNutrition")}
              </h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("nutrition.totalCalories")}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalCalories.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("nutrition.carbs")}</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {totalCarbs}
                </p>
                <p className="text-xs text-gray-500">g</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("nutrition.protein")}</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {totalProtein}
                </p>
                <p className="text-xs text-gray-500">g</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("nutrition.fat")}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalFat}
                </p>
                <p className="text-xs text-gray-500">g</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {foodItems.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
          <Apple className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-600 dark:text-gray-400">
            {t("nutrition.emptyFood")}
          </p>
        </div>
      )}
    </div>
  );
};
