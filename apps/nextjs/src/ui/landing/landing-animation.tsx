"use client";

import Lottie from "lottie-react";
import animationData from "../../../public/animations/smart-chat.json";

export default function LandingAnimation() {
  return (
    <div className="h-full w-full">
      <Lottie animationData={animationData} loop={true} className="h-full w-full" />
    </div>
  );
}
