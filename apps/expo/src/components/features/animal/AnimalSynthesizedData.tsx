import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnimalSynthesizedDataProps {
  animal: any;
}

export const AnimalSynthesizedData: React.FC<AnimalSynthesizedDataProps> = ({
  animal,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synthesized Data</Text>
      <Text>Weight: {animal.weight ? `${animal.weight} kg` : "N/A"}</Text>
      <Text>
        Last Vaccination:{" "}
        {animal.lastVaccinationDate
          ? animal.lastVaccinationDate.toDateString()
          : "N/A"}
      </Text>
      <Text>
        Dietary Restrictions: {animal.dietaryRestrictions?.join(", ") || "None"}
      </Text>
      <Text>
        Known Allergies: {animal.knownAllergies?.join(", ") || "None"}
      </Text>
      <Text>
        Recent Symptoms: {animal.recentSymptoms?.join(", ") || "None"}
      </Text>
      <Text>Behavioral Notes: {animal.behavioralNotes || "N/A"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
