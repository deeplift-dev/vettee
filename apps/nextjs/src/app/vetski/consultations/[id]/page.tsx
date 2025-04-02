import { notFound } from "next/navigation";

import ConsultationView from "~/app/_components/consults/consultation-view";
import SafeArea from "~/app/_components/layout/safe-area";
import { api } from "~/trpc/server";

interface ConsultationPageProps {
  params: {
    id: string;
  };
}

export default async function ConsultationPage({
  params,
}: ConsultationPageProps) {
  const consultation = await api.consultation.getById
    .query(params.id)
    .catch(() => null);

  if (!consultation) {
    notFound();
  }

  return (
    <SafeArea>
      <div className="h-screen overflow-hidden">
        <div className="h-full w-full pt-20">
          <ConsultationView consultation={consultation} />
        </div>
      </div>
    </SafeArea>
  );
}
