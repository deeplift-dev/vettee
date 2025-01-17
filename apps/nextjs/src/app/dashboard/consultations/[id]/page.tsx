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
  console.log("params", params);
  const consultation = await api.consultation.getById
    .query(params.id)
    .catch(() => null);

  if (!consultation) {
    // notFound();
  }

  return (
    <SafeArea>
      <div className="mx-auto flex h-full max-w-screen-xl flex-row items-center justify-center md:p-4">
        {/* <ConsultationView consultation={consultation} /> */}
      </div>
    </SafeArea>
  );
}
