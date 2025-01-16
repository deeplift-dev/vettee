import { notFound } from "next/navigation";

import ConsultationView from "~/app/_components/consults/consultation-view";
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

  return <ConsultationView consultation={consultation} />;
}
