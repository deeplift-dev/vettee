import { z } from "zod";

import type { Species } from "./vet-calculation-service";
import { calculateMedicationDose } from "./vet-calculation-service";

// Define the schema for the medication calculation tool
export const calculationTool = {
  name: "calculate_medication_dose",
  description:
    "Calculate medication dosage for veterinary patients based on weight, dose, and concentration",
  schema: z.object({
    weight: z.number().describe("Patient weight in kilograms"),
    dose: z
      .number()
      .describe("Medication dose in units per kg (e.g., mg/kg, mcg/kg)"),
    concentration: z
      .number()
      .describe("Medication concentration (e.g., mg/ml, mcg/ml)"),
    species: z
      .enum(["canine", "feline", "rabbit", "avian", "exotic"])
      .describe("Patient species"),
    doseUnit: z
      .enum(["mg/kg", "mcg/kg", "ml/kg"])
      .describe("Units for the dose"),
    concentrationUnit: z
      .enum(["mg/ml", "mcg/ml"])
      .describe("Units for the concentration"),
  }),
  execute: async (params) => {
    // ...existing code...
  },
};

// Define the schema for retrieving reference values
export const referenceValuesTool = {
  name: "get_reference_values",
  description:
    "Get normal physiological reference values for a specific animal species",
  schema: z.object({
    species: z
      .enum(["canine", "feline", "rabbit", "avian", "exotic"])
      .describe("Animal species to get reference values for"),
  }),
  execute: async ({ species }) => {
    // ...existing code...
  },
};

// Define the schema for medication warnings
export const medicationWarningsTool = {
  name: "get_medication_warnings",
  description:
    "Get warnings and contraindications for common veterinary medications",
  schema: z.object({
    medication: z
      .string()
      .describe("Name of the medication to get warnings for"),
    species: z
      .enum(["canine", "feline", "rabbit", "avian", "exotic"])
      .describe("Animal species"),
  }),
  execute: async ({ medication, species }) => {
    // ...existing code...
  },
};

// New tool specifically for displaying medication information
export const displayMedicationInfoTool = {
  name: "displayMedicationInfo",
  description:
    "Display comprehensive information about a specific medication including dosages, administration routes, indications, contraindications, and species-specific considerations. Use this whenever discussing medication dosages, drug administration, or when mentioning specific medications like antibiotics, analgesics, sedatives, etc.",
  schema: z.object({
    medication: z
      .string()
      .describe(
        "Name of the medication (e.g., buprenorphine, meloxicam, amoxicillin)",
      ),
    species: z
      .enum(["canine", "feline", "rabbit", "avian", "exotic"])
      .optional()
      .describe("Animal species for species-specific information"),
    weight: z
      .number()
      .optional()
      .describe(
        "Patient weight in kg if available for calculating example doses",
      ),
    purpose: z
      .enum([
        "analgesia",
        "sedation",
        "anesthesia",
        "antibiotic",
        "anti-inflammatory",
        "other",
      ])
      .optional()
      .describe("Primary purpose of the medication"),
  }),
  execute: async (params) => {
    const { medication, species, weight, purpose } = params;

    // Medication database (simplified example)
    const medicationInfo = getMedicationInfo(medication);

    // Calculate example doses if weight is provided
    let exampleDoses = null;
    if (weight && medicationInfo.dosages) {
      const doseRange =
        medicationInfo.dosages[species || "canine"] ||
        medicationInfo.dosages.default;
      if (doseRange) {
        const [minDose, maxDose] = doseRange;
        exampleDoses = {
          minDose: {
            value: parseFloat((minDose * weight).toFixed(2)),
            unit: medicationInfo.unit,
          },
          maxDose: {
            value: parseFloat((maxDose * weight).toFixed(2)),
            unit: medicationInfo.unit,
          },
        };
      }
    }

    // Format the response with standardized sections
    return {
      name: medicationInfo.name,
      classification: medicationInfo.classification,
      dosages: medicationInfo.dosages,
      routes: medicationInfo.routes,
      indications: medicationInfo.indications,
      contraindications: medicationInfo.contraindications,
      warnings: medicationInfo.warnings,
      exampleDoses,
      references: medicationInfo.references,
    };
  },
};

// Helper function to get medication info from a database
function getMedicationInfo(medicationName) {
  // This would ideally pull from a comprehensive database
  // Example for buprenorphine
  const medications = {
    buprenorphine: {
      name: "Buprenorphine",
      classification: "Opioid analgesic (partial mu agonist)",
      dosages: {
        canine: [0.01, 0.02], // mg/kg range
        feline: [0.01, 0.02],
        default: [0.01, 0.02],
      },
      unit: "mg",
      routes: ["IV", "IM", "SC", "OTM (cats)"],
      indications: [
        "Moderate to severe pain",
        "Perioperative analgesia",
        "Chronic pain management",
      ],
      contraindications: [
        "Hypersensitivity to buprenorphine",
        "Severe respiratory depression",
        "Head trauma with increased intracranial pressure",
      ],
      warnings: [
        "May cause respiratory depression at high doses",
        "Use with caution in patients with hepatic or renal impairment",
        "May cause mild sedation in some patients",
      ],
      references: [
        "Plumb's Veterinary Drug Handbook",
        "BSAVA Small Animal Formulary",
      ],
    },
    meloxicam: {
      name: "Meloxicam",
      classification: "Non-steroidal anti-inflammatory drug (NSAID)",
      dosages: {
        canine: [0.1, 0.2], // mg/kg range (initial dose 0.2, maintenance 0.1)
        feline: [0.05, 0.1], // Single dose only in many jurisdictions
        default: [0.1, 0.2],
      },
      unit: "mg",
      routes: ["PO", "SC", "IV"],
      indications: [
        "Pain and inflammation associated with musculoskeletal disorders",
        "Post-operative pain",
      ],
      contraindications: [
        "Gastrointestinal ulceration or bleeding",
        "Renal or hepatic impairment",
        "Concurrent use with other NSAIDs or corticosteroids",
        "Pregnancy or lactation",
      ],
      warnings: [
        "Risk of gastrointestinal ulceration or perforation",
        "Monitor renal function with long-term use",
        "Only approved for single dose in cats in many jurisdictions",
        "Ensure patient is well-hydrated before administration",
      ],
      references: [
        "Plumb's Veterinary Drug Handbook",
        "BSAVA Small Animal Formulary",
      ],
    },
    // Add more medications as needed
  };

  // Normalize medication name for lookup (case insensitive, partial matching)
  const normalizedInput = medicationName.toLowerCase();

  // Find exact match
  if (medications[normalizedInput]) {
    return medications[normalizedInput];
  }

  // Find partial match
  for (const [key, info] of Object.entries(medications)) {
    if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
      return info;
    }
  }

  // Default response if no match found
  return {
    name: medicationName,
    classification: "Not found in database",
    dosages: {
      default: [0, 0],
    },
    unit: "mg",
    routes: [],
    indications: [
      "Please consult a veterinary reference for information on this medication",
    ],
    contraindications: [],
    warnings: [
      "No specific information available. Consult a veterinary formulary.",
    ],
    references: [
      "Plumb's Veterinary Drug Handbook",
      "BSAVA Small Animal Formulary",
    ],
  };
}
