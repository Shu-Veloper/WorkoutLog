"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { useState } from "react";
import { DayButton } from "react-day-picker";

const CustomDayButton = (props: React.ComponentProps<typeof DayButton>) => {
  const { day } = props;

  // 특정 날짜에 표시할 텍스트 (예시)
  const getTextForDate = (date: Date) => {
    const day = date.getDate();
    return "";
  };

  return (
    <CalendarDayButton {...props}>
      {day.date.getDate()}
      {getTextForDate(day.date) && (
        <span className="text-xs opacity-70">{getTextForDate(day.date)}</span>
      )}
    </CalendarDayButton>
  );
};

export const CalendarContorll = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  console.log("date", date);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border w-1/2"
      components={{
        DayButton: CustomDayButton,
      }}
    />
  );
};
