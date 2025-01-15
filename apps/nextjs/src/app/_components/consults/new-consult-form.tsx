"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import OwnerSearch from "../owner-search";
import PatientConsent from "../patient-consent";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const NewConsultForm = () => {
  const { mutate: createConsultation } = api.consultation.create.useMutation({
    onSuccess: (data) => {
      // Handle success
      console.log("Consultation created:", data);
    },
    onError: (error) => {
      // Handle error
      console.error("Error creating consultation:", error);
    },
  });

  const [consent, setConsent] = useState(false);

  return (
    <div className="relative flex w-full max-w-md flex-col gap-4 pt-24">
      <div className="absolute left-1/2 top-2/3 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform-gpu items-center justify-center overflow-hidden blur-3xl">
        <div className="h-full w-full bg-rose-200/60"></div>
      </div>
      <div className="w-full rounded-2xl border border-white/20 bg-black/95 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex items-center justify-center">
              <div className="h-12 w-12 rounded-lg bg-slate-900 text-lg">
                <div className="flex h-full w-full items-center justify-center"></div>
              </div>
            </div>
            <div className="text-center text-lg text-white">
              Start a new consult
            </div>
            <div className="text-center text-sm font-light text-white/50"></div>
            <div>
              <Input
                className="w-full border-none bg-black/50 text-white"
                type="text"
                placeholder="Owner name"
              />
            </div>
            <div>
              <OwnerSearch />
              {/* <Input
                className="w-full border-none bg-black/50 text-white"
                type="text"
                placeholder="Animal name"
              /> */}
            </div>
            <div>
              <PatientConsent checked={consent} onChange={setConsent} />
            </div>
            <div>
              <Button disabled={!consent} className="w-full">
                Start Consult
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConsultForm;
