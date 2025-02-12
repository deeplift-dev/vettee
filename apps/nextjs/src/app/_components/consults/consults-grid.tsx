import Link from "next/link";

import { api } from "~/trpc/server";
import { EmptyConsultationIllustration } from "../illustrations/empty-consultation";
import ProfileAvatar from "../ui/profile-avatar";

const ConsultsGrid = async () => {
  const consultations = await api.consultation.getByVeterinarianId.query();

  // Sort consultations by date
  const sortedConsultations = [...consultations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (sortedConsultations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <EmptyConsultationIllustration className="h-48 w-48" />
          <div className="-mt-12 text-lg font-light text-gray-400">
            No consultations yet
          </div>
          <div className="text-sm text-gray-500">
            When you receive consultations, they will appear here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="sticky top-0 z-10 hidden border-b border-white/30 bg-black/50 backdrop-blur-sm md:grid md:grid-cols-5 md:gap-4 md:px-6 md:py-3">
          <div className="font-medium text-gray-200">Title</div>
          <div className="font-medium text-gray-200">Owner</div>
          <div className="font-medium text-gray-200">Veterinarian</div>
          <div className="font-medium text-gray-200">Date</div>
        </div>

        {/* Mobile view */}
        <div className="h-[calc(100vh-10rem)] space-y-4 overflow-y-auto p-4 md:hidden">
          {sortedConsultations.map((consultation) => (
            <Link
              href={`/vetski/consultations/${consultation.id}`}
              key={consultation.id}
              className="block rounded-lg border border-white/30 bg-black/20 p-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-50">
                    {consultation.title}
                  </h3>
                  <span className="text-sm text-gray-300">
                    {new Date(consultation.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Owner: {consultation?.owner?.firstName ?? "Unknown"}
                </div>
                <div className="flex items-center gap-2">
                  <ProfileAvatar
                    profile={{
                      firstName: consultation.veterinarian?.firstName ?? "",
                      lastName: consultation.veterinarian?.lastName ?? "",
                      image: consultation.veterinarian?.image ?? "",
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop view */}
        <div className="scrollbar-hide hidden h-[calc(100vh-20rem)] overflow-y-auto md:block">
          {sortedConsultations.map((consultation) => (
            <Link
              href={`/vetski/consultations/${consultation.id}`}
              key={consultation.id}
              className="grid grid-cols-5 gap-4 border-b border-white/10 px-6 py-4 transition-colors hover:bg-white/5"
            >
              <div className="truncate text-gray-50">{consultation.title}</div>
              <div className="text-gray-300">
                {consultation?.owner?.firstName ?? "Unknown"}
              </div>
              <div className="flex items-center gap-2">
                <ProfileAvatar
                  profile={{
                    firstName: consultation.veterinarian?.firstName ?? "",
                    lastName: consultation.veterinarian?.lastName ?? "",
                    image: consultation.veterinarian?.image ?? "",
                  }}
                />
                <span className="text-gray-300">
                  {consultation.veterinarian?.firstName}{" "}
                  {consultation.veterinarian?.lastName}
                </span>
              </div>
              <div className="text-gray-300">
                {new Date(consultation.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultsGrid;
