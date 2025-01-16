"use client";

import type { RouterOutputs } from "@acme/api";

interface ConsultationViewProps {
  consultation: RouterOutputs["consultation"]["getById"];
}

export default function ConsultationView({
  consultation,
}: ConsultationViewProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-lg border border-white/20 bg-black/95 p-6">
        <h1 className="text-2xl font-semibold text-white">
          {consultation.title}
        </h1>

        <div className="mt-4 flex flex-col gap-2">
          <div className="text-sm text-white/70">
            Created: {new Date(consultation.createdAt).toLocaleString()}
          </div>

          {consultation.animal && (
            <div className="rounded-md border border-white/10 bg-white/5 p-3">
              <h2 className="font-medium text-white">Patient</h2>
              <div className="mt-1 text-sm text-white/70">
                {consultation.animal.name} • {consultation.animal.species}
                {consultation.animal.yearOfBirth &&
                  ` • Born ${consultation.animal.yearOfBirth}`}
              </div>
            </div>
          )}

          {consultation.owner && (
            <div className="rounded-md border border-white/10 bg-white/5 p-3">
              <h2 className="font-medium text-white">Owner</h2>
              <div className="mt-1 text-sm text-white/70">
                {consultation.owner.firstName} {consultation.owner.lastName}
                {consultation.owner.email && (
                  <div>{consultation.owner.email}</div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <h2 className="font-medium text-white">Recording Consent</h2>
            <div className="mt-1 text-sm text-white/70">
              {consultation.consentedAt
                ? `Consented at ${new Date(consultation.consentedAt).toLocaleString()}`
                : "No consent provided"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
