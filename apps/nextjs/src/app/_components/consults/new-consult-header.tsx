"use client";

import React from "react";

interface NewConsultHeaderProps {
  // Add props if needed
}

const NewConsultHeader: React.FC<NewConsultHeaderProps> = () => {
  return (
    <div className="flex w-full border-b border-white border-opacity-10 bg-transparent px-4 pb-5 dark:bg-transparent">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-base font-light">Create New Consult</h2>
          <div className="flex gap-2">
            <button className="rounded bg-white px-3 py-1.5 text-sm text-slate-800">
              Add Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConsultHeader;
