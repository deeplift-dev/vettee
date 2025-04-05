import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Info,
  ShieldAlert,
  ShieldCheck,
  Syringe,
  Target,
  Weight,
} from "lucide-react";

interface MedicationInfoProps {
  medicationData: {
    medication: string;
    dosage: string;
    usage: string;
    notes?: string;
    warnings?: string;
  };
}

export function MedicationInfoCard({ medicationData }: MedicationInfoProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-gray-700 bg-gray-800/30 shadow-md">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between bg-gray-700/50 px-4 py-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Syringe className="mr-2 h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              {medicationData.medication}
            </h3>
          </div>
        </div>
        <button className="rounded-full bg-gray-800/50 p-1 hover:bg-gray-600/50">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-300" />
          )}
        </button>
      </div>

      {/* Collapsible Content */}
      {expanded && (
        <div className="px-4 py-3">
          {/* Dosage Information */}
          <div className="mb-4">
            <h4 className="text-md mb-2 flex items-center font-medium text-gray-200">
              <Target className="mr-2 h-4 w-4 text-blue-400" />
              Dosage Information
            </h4>
            <div className="rounded-md bg-gray-700/30 p-2 text-sm">
              <span className="text-white">{medicationData.dosage}</span>
            </div>
          </div>

          {/* Usage */}
          <div className="mb-4">
            <h4 className="text-md mb-2 flex items-center font-medium text-gray-200">
              <Syringe className="mr-2 h-4 w-4 text-blue-400" />
              Usage
            </h4>
            <div className="rounded-md bg-gray-700/30 p-2 text-sm">
              <span className="text-white">{medicationData.usage}</span>
            </div>
          </div>

          {/* Notes */}
          {medicationData.notes && (
            <div className="mb-4">
              <h4 className="text-md mb-2 flex items-center font-medium text-gray-200">
                <Info className="mr-2 h-4 w-4 text-blue-400" />
                Notes
              </h4>
              <div className="rounded-md bg-gray-700/30 p-2 text-sm">
                <span className="text-white">{medicationData.notes}</span>
              </div>
            </div>
          )}

          {/* Warnings */}
          {medicationData.warnings && (
            <div className="mb-4 rounded-md bg-red-900/10 p-3">
              <h4 className="text-md mb-2 flex items-center font-medium text-red-300">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Warnings
              </h4>
              <div className="text-sm text-gray-200">
                {medicationData.warnings}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
