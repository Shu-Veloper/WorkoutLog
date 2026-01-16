"use client";

import { useState } from "react";
import { NavBar } from "./components/navBar/NavBar";
import { HomeTabContent } from "./components/HomeTabContent";
import { NutritionView } from "./components/NutritionView";
import { RecordingView } from "./components/RecordingView";
import { FooterTab, TabType } from "./components/FooterTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTabContent />;
      case "record":
        return <RecordingView />;
      case "nutrition":
        return <NutritionView />;
      default:
        return null;
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 네비게이션 헤더 */}
      <NavBar />

      {/* 메인 컨텐츠 - Footer 높이만큼 padding 추가 */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {renderContent()}
      </main>

      {/* Footer Tab 네비게이션 */}
      <FooterTab activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
