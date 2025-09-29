"use client";
import { NavBar } from "./components/navBar/NavBar";
import { DashboardContent } from "./components/DashboardContent";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <DashboardContent />
    </div>
  );
}
