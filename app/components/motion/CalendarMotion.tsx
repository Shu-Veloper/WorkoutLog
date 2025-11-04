import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type PropsType = {
  days: (number | null)[];
  currentYear: number | null;
  currentMonth: number | null;
  direction: 1 | -1;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handlePrevMonth?: () => void;
  handleNextMonth?: () => void;
};

export const CalendarMotion = ({
  days,
  currentYear,
  currentMonth,
  direction,
  setIsModalOpen,
  handlePrevMonth,
  handleNextMonth,
}: PropsType) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="max-w-1/2 mx-auto">
      {/* 년/월 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className="text-lg font-semibold cursor-pointer"
          onClick={() => setIsModalOpen && setIsModalOpen(true)}
        >
          {currentYear}년 {currentMonth && currentMonth + 1}월
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentYear} - ${currentMonth}`}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-7 gap-2"
          >
            {days.map((day, index) => (
              <div
                key={index}
                className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm
                    ${day ? "cursor-pointer hover:bg-gray-100" : ""}
                  `}
              >
                {day}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
