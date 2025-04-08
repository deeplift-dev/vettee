"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LogIn } from "lucide-react";

import { is } from "@acme/db";

import { api } from "~/trpc/react";
import { NewConsultIcon } from "../illustrations/new-consult-icon";
import OwnerSearch from "../owner-search";
import PatientConsent from "../patient-consent";
import { Button } from "../ui/button";

const NewConsultForm = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();
  }, [supabase.auth]);

  const { mutate: createConsultation, isPending } =
    api.consultation.create.useMutation({
      onSuccess: (data) => {
        // Redirect to the consultation detail page
        router.push(`/vetski/consultations/${data.id}`);
      },
      onError: (error) => {
        console.error("Error creating consultation:", error);
        // Optionally add error toast/notification here
      },
    });
  const [consent, setConsent] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Profile | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const handleStartConsult = () => {
    createConsultation({
      recordingConsent: consent,
      ownerId: selectedOwner?.id,
      animalId: selectedAnimal?.id,
    });
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  }

  // Not authenticated state
  if (isAuthenticated === false) {
    return (
      <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-4 pt-24">
        <div className="absolute left-1/2 top-2/3 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform-gpu items-center justify-center overflow-hidden blur-3xl">
          <div className="h-full w-full bg-rose-200/60"></div>
        </div>
        <div className="w-full rounded-2xl border border-white/20 bg-black/95 p-8 text-center">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900">
                <LogIn className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-xl font-medium text-white">
              Authentication Required
            </div>
            <div className="text-sm text-white/60">
              You need to be signed in to start a new consultation.
            </div>
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated state - show the form
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
                <div className="flex h-full w-full items-center justify-center">
                  <NewConsultIcon />
                </div>
              </div>
            </div>
            <div className="text-center text-lg text-white">
              Start a new consult
            </div>
            <div className="text-center text-sm font-light text-white/50"></div>
            <div>
              <OwnerSearch
                onSelect={setSelectedOwner}
                onAnimalSelect={setSelectedAnimal}
              />
            </div>
            <div>
              <PatientConsent checked={consent} onChange={setConsent} />
            </div>
            <div>
              <Button
                onClick={handleStartConsult}
                className="w-full"
                isLoading={isPending}
              >
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
