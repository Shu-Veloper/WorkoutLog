"use client";

import { useState } from "react";
import { NavBar } from "./components/navBar/NavBar";
import { HomeTabContent } from "./components/HomeTabContent";
import { NutritionView } from "./components/NutritionView";
import { ComingSoonView } from "./components/ComingSoonView";
import { FooterTab, TabType } from "./components/FooterTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isRecordPage, setIsRecordPage] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeTabContent
            isRecordPage={isRecordPage}
            onRecordPageChange={setIsRecordPage}
          />
        );
      case "nutrition":
        return <NutritionView />;
      case "coming-soon":
        return <ComingSoonView />;
      default:
        return null;
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 네비게이션 헤더 */}
      <NavBar isRecordPage={isRecordPage} onViewChange={setIsRecordPage} />

      {/* 메인 컨텐츠 - Footer 높이만큼 padding 추가 */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {renderContent()}
      </main>

      {/* Footer Tab 네비게이션 */}
      <FooterTab activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
