"use client";

import { Suspense } from "react";
import Navbar from "./navbar";
import Projects from "./projects";
import LoadingIcon from "../loading-icon";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <Navbar />

      <div className="mt-12 w-full max-w-7xl p-4">
        <Suspense fallback={<LoadingIcon />}>
          <Projects />
        </Suspense>
      </div>
    </div>
  );
}
