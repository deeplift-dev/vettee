import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
      <div className="flex h-[calc(100vh-20rem)] w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 p-10 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <EmptyConsultationIllustration className="h-48 w-48" />
          <div className="-mt-8 text-lg font-medium text-white/80">
            No consultations yet
          </div>
          <div className="mt-2 max-w-md text-sm text-white/50">
            When you create consultations, they will appear here. Start by
            creating a new consultation.
          </div>
          <Link href="/vetski/consults/new" className="mt-6">
            <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-[#0A0A0A] shadow-sm transition-all duration-200 hover:shadow-md">
              Create your first consultation
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-sm">
      <div className="flex items-center justify-end">
        <Link
          href="/vetski/consultations"
          className="text-sm text-white/70 hover:text-white"
        >
          View all
        </Link>
      </div>

      <div className="min-w-full rounded-lg border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm">
        {/* Header */}
        <div className="sticky top-0 z-10 hidden border-b border-white/10 bg-white/5 backdrop-blur-sm md:grid md:grid-cols-5 md:gap-4 md:px-6 md:py-3">
          <div className="text-sm font-medium text-white/70">Title</div>
          <div className="text-sm font-medium text-white/70">Owner</div>
          <div className="text-sm font-medium text-white/70">Veterinarian</div>
          <div className="text-sm font-medium text-white/70">Date</div>
          <div className="text-sm font-medium text-white/70"></div>
        </div>

        {/* Mobile view */}
        <div className="max-h-[calc(100vh-20rem)] space-y-2 overflow-y-auto p-4 md:hidden">
          {sortedConsultations.map((consultation) => (
            <Link
              href={`/vetski/consultations/${consultation.id}`}
              key={consultation.id}
              className="block rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-white/20 hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">
                    {consultation.title}
                  </h3>
                  <ChevronRight className="h-4 w-4 text-white/50" />
                </div>
                <div className="text-sm text-white/70">
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
                  <span className="text-sm text-white/70">
                    {new Date(consultation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden max-h-[calc(100vh-20rem)] overflow-y-auto md:block">
          {sortedConsultations.map((consultation, index) => (
            <Link
              href={`/vetski/consultations/${consultation.id}`}
              key={consultation.id}
              className={`grid grid-cols-5 gap-4 px-6 py-2 transition-colors hover:bg-white/5 items-center${
                index !== sortedConsultations.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              <div className="truncate font-medium text-white">
                {consultation.title}
              </div>
              <div className="text-white/70">
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
                <span className="text-white/70">
                  {consultation.veterinarian?.firstName}{" "}
                  {consultation.veterinarian?.lastName}
                </span>
              </div>
              <div className="text-white/70">
                {new Date(consultation.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex justify-end">
                <ChevronRight className="h-5 w-5 text-white/50" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultsGrid;
