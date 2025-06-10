import Link from "next/link";
import { CheckCircle, ChevronRight, XCircle } from "lucide-react";

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
          <Link href="/app/consults/new" className="mt-6">
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
      <div className="min-w-full rounded-lg border border-white/10 bg-black/40 shadow-lg backdrop-blur-sm">
        {/* Header */}
        <div className="sticky top-0 z-10 hidden border-b border-white/10 bg-black/60 backdrop-blur-sm md:grid md:grid-cols-6 md:gap-4 md:px-6 md:py-3">
          <div className="text-sm font-medium text-white/70">Title</div>
          <div className="text-sm font-medium text-white/70">Owner</div>
          <div className="text-sm font-medium text-white/70">Veterinarian</div>
          <div className="text-sm font-medium text-white/70">Consent</div>
          <div className="text-sm font-medium text-white/70">Date</div>
          <div className="text-sm font-medium text-white/70"></div>
        </div>

        {/* Mobile view */}
        <div className="scrollbar-hide max-h-[calc(100vh-20rem)] space-y-2 overflow-y-auto p-4 md:hidden">
          {sortedConsultations.map((consultation) => (
            <Link
              href={`/app/consultations/${consultation.id}`}
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
        <div className="scrollbar-hide hidden max-h-[calc(100vh-20rem)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] md:block">
          {sortedConsultations.map((consultation, index) => (
            <Link
              href={`/app/consultations/${consultation.id}`}
              key={consultation.id}
              className={`grid transform grid-cols-6 items-center gap-4 px-6 py-2 transition-all duration-150 ease-out hover:scale-[1.01] hover:bg-white/10 ${
                index !== sortedConsultations.length - 1
                  ? "border-b border-white/10"
                  : ""
              } ${index % 2 === 0 ? "bg-black/30" : "bg-black/20"}`}
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
              <div className="flex items-center gap-1">
                {consultation.consentedAt ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-white/70 md:text-sm">
                  {consultation.consentedAt ? "Yes" : "No"}
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
