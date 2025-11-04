import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";

type PropsType = {
  handleSaveModal: (year: number, month: number) => void;
  isModalopen: boolean;
};

export const CalendarModal = ({ handleSaveModal, isModalopen }: PropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(1);

  const years = Array.from({ length: 20 }, (_, i) => 2015 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div
      className={`opacity-0 ${
        isModalopen && "opacity-100"
      } absolute bg-red flex top-0 -translate-y-5 left-3/5`}
    >
      <div className="p-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          {selectedYear}년 {selectedMonth}월 선택
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ y: 400 }}
                animate={{ y: 0 }}
                exit={{ y: 400 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-3xl p-6 w-full max-w-md shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">년/월 선택</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* 년도와 월 */}
                <div className="flex gap-4 mb-8">
                  {/* 년도 스크롤 */}
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">
                      년도
                    </label>
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() =>
                          setSelectedYear((prev) => Math.max(prev - 1, 2015))
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <div className="w-full py-4 bg-purple-50 rounded-lg text-center text-2xl font-bold border-2 border-purple-200">
                        {selectedYear}
                      </div>
                      <button
                        onClick={() =>
                          setSelectedYear((prev) => Math.min(prev + 1, 2034))
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>

                  {/* 월 스크롤 */}
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-600 mb-3">
                      월
                    </label>
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() =>
                          setSelectedMonth((prev) =>
                            prev === 1 ? 12 : prev - 1
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <div className="w-full py-4 bg-purple-50 rounded-lg text-center text-2xl font-bold border-2 border-purple-200">
                        {selectedMonth}
                      </div>
                      <button
                        onClick={() =>
                          setSelectedMonth((prev) =>
                            prev === 12 ? 1 : prev + 1
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
                  >
                    확인
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
