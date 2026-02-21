"use client";
import { useAppStore } from "@/store/useAppStore";

export default function Header() {
  const { siteTitle, isUrdu } = useAppStore();
  return (
    <header className="bg-(--site-2) text-white p-6 text-center">
      <h1 className={`text-4xl font-semibold ${isUrdu ? "urdu-text" : ""}`}>
        {siteTitle}
      </h1>
    </header>
  );
}
