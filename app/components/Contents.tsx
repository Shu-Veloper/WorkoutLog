"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CalendarMotion } from "./motion/CalendarMotion";
import { s } from "framer-motion/client";
import { CalendarModal } from "./CalendarModal";
import { CalendarComponents } from "./CalendarComponents";

type SelectedMonth = {
  year: number;
  month: number;
};

export const Contents = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const [days, setDays] = useState<(number | null)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [direction, setDirection] = useState<1 | -1>(1); // 이전/다음 방향 추적

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dayInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= dayInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (currentMonth === null || currentYear === null) return;
    setDirection(-1);
    let newYear = currentYear;
    let newMonth = currentMonth - 1;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    setDays(getDaysInMonth(newYear, newMonth));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    if (currentMonth === null || currentYear === null) return;
    setDirection(1);
    let newYear = currentYear;
    let newMonth = currentMonth + 1;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    setDays(getDaysInMonth(newYear, newMonth));
  };

  const handleSaveModal = (year: number, month: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    setDays(getDaysInMonth(year, month));
    setIsModalOpen(false);
    // setSelectedMonth({ year, month });
  };

  // 클라이언트에서만 날짜 계산
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    setCurrentYear(year);
    setCurrentMonth(month);
    setDays(getDaysInMonth(year, month));
  }, []);

  if (currentYear === null || currentMonth === null) {
    // SSR 단계에서는 아무것도 렌더링하지 않음 → mismatch 방지
    return <div className="p-4 text-gray-500">Loading...</div>;
  }
  console.log("isModalOpen:", isModalOpen);

  return (
    <div className="p-4 relative">
      <CalendarComponents />
      {/* <CalendarMotion
        days={days}
        currentYear={currentYear}
        currentMonth={currentMonth}
        direction={direction}
        setIsModalOpen={setIsModalOpen}
        handleNextMonth={handleNextMonth}
        handlePrevMonth={handlePrevMonth}
      /> */}
      {/* <CalendarModal
        handleSaveModal={handleSaveModal}
        isModalopen={isModalOpen}
      /> */}
    </div>
  );
};
