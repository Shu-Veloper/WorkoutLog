"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

export function CalendarComponents() {
  const [mounted, setMounted] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    const today = new Date();
    setDate(today);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4 text-gray-500 text-center">로딩 중...</div>;
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm min-w-1/3 mx-auto"
      captionLayout="dropdown"
    />
  );
}
