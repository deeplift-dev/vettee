"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LogIn, Plus } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "../ui/button";

const NewConsultButton = () => {
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
        router.push(`/app/consultations/${data.id}`);
      },
      onError: (error) => {
        console.error("Error creating consultation:", error);
      },
    });

  const handleStartConsult = () => {
    createConsultation({
      recordingConsent: true,
    });
  };

  // Not authenticated state
  if (isAuthenticated === false) {
    return (
      <Link href="/auth/login">
        <Button size="sm" variant="default">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </Link>
    );
  }

  // Button for authenticated users
  return (
    <Button
      className="text-xs"
      onClick={handleStartConsult}
      isLoading={isPending}
      size="sm"
    >
      <Plus className="mr-2 h-4 w-4" />
      New Consult
    </Button>
  );
};

export default NewConsultButton;
