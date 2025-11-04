"use client";

import { Home, Utensils, Clock } from "lucide-react";

export type TabType = "home" | "nutrition" | "coming-soon";

interface FooterTabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const FooterTab = ({ activeTab, onTabChange }: FooterTabProps) => {
  const tabs = [
    {
      id: "home" as TabType,
      label: "홈",
      icon: Home,
    },
    {
      id: "nutrition" as TabType,
      label: "식단",
      icon: Utensils,
    },
    {
      id: "coming-soon" as TabType,
      label: "준비중",
      icon: Clock,
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <nav className="max-w-7xl mx-auto">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 ${
                    isActive ? "stroke-[2.5]" : "stroke-2"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </footer>
  );
};
