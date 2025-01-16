"use client";

import { useEffect, useState } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AnimalProfileProps {
  ownerId?: string;
  onSelect: (animal: Animal | null) => void;
}

type Animal = RouterOutputs["animal"]["search"][number];

export default function AnimalProfile({
  ownerId,
  onSelect,
}: AnimalProfileProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCreateFields, setShowCreateFields] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [weight, setWeight] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    yearOfBirth: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data: searchResults } = api.animal.search.useQuery(
    { query: debouncedSearch, ownerId },
    {
      enabled: debouncedSearch.length > 0 && !selectedAnimal && !!ownerId,
    },
  );

  const { mutate: createAnimal } = api.animal.create.useMutation({
    onSuccess: (data) => {
      setSelectedAnimal(data);
      onSelect(data);
      setShowCreateFields(false);
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (selectedAnimal) {
      setSelectedAnimal(null);
      onSelect(null);
    }
  };

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setSearchValue(animal.name);
    onSelect(animal);
  };

  const handleCreateAnimal = () => {
    if (!showCreateFields) {
      setShowCreateFields(true);
      return;
    }

    if (!ownerId) {
      setErrors((prev) => ({
        ...prev,
        name: "Please select an owner first",
      }));
      return;
    }

    // Reset errors
    setErrors({ name: "", yearOfBirth: "" });

    // Validate fields
    let hasErrors = false;

    if (!name) {
      setErrors((prev) => ({
        ...prev,
        name: "Name is required",
      }));
      hasErrors = true;
    }

    if (!yearOfBirth) {
      setErrors((prev) => ({
        ...prev,
        yearOfBirth: "Year of birth is required",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    createAnimal({
      name,
      species,
      yearOfBirth,
      weight,
      ownerId,
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className={`flex ${showCreateFields ? "" : "gap-2"}`}>
            {selectedAnimal ? (
              <div className="flex w-full items-center gap-2 rounded-md border border-white/20 bg-black/50 p-2 text-white">
                <div className="flex flex-1 flex-col">
                  <div>{selectedAnimal.name}</div>
                  <div className="text-sm text-white/70">
                    {selectedAnimal.species}
                    {selectedAnimal.yearOfBirth &&
                      ` • Born ${selectedAnimal.yearOfBirth}`}
                    {selectedAnimal.weight && ` • ${selectedAnimal.weight}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAnimal(null);
                    setSearchValue("");
                    onSelect(null);
                  }}
                  className="h-6 hover:bg-white/10"
                >
                  ✕
                </Button>
              </div>
            ) : (
              !showCreateFields && (
                <>
                  <Input
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={
                      ownerId
                        ? "Search for animal by name"
                        : "Select owner first"
                    }
                    disabled={!ownerId}
                    className="w-full border border-white/20 bg-black/50 text-white focus:border-white/40"
                  />
                  {!showCreateFields &&
                    !selectedAnimal &&
                    searchValue.length > 0 && (
                      <Button
                        onClick={handleCreateAnimal}
                        className="bg-white/10 hover:bg-white/20"
                        disabled={!ownerId}
                      >
                        Create
                      </Button>
                    )}
                </>
              )
            )}
          </div>
        </div>

        {showCreateFields && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="animal-name" className="text-sm text-white">
                Name
              </Label>
              <Input
                id="animal-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter animal name"
                className={`w-full border border-white/20 bg-black/50 text-white focus:border-white/40 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <div className="mt-1 text-xs text-red-500">{errors.name}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="animal-species" className="text-sm text-white">
                Species
              </Label>
              <Input
                id="animal-species"
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g., Dog, Cat, etc."
                className="w-full border border-white/20 bg-black/50 text-white focus:border-white/40"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <Label
                  htmlFor="animal-birth-year"
                  className="text-sm text-white"
                >
                  Year of Birth
                </Label>
                <Input
                  id="animal-birth-year"
                  type="text"
                  value={yearOfBirth}
                  onChange={(e) => setYearOfBirth(e.target.value)}
                  placeholder="YYYY"
                  className={`w-full border border-white/20 bg-black/50 text-white focus:border-white/40 ${
                    errors.yearOfBirth ? "border-red-500" : ""
                  }`}
                />
                {errors.yearOfBirth && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.yearOfBirth}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="animal-weight" className="text-sm text-white">
                  Weight
                </Label>
                <Input
                  id="animal-weight"
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 25kg"
                  className="w-full border border-white/20 bg-black/50 text-white focus:border-white/40"
                />
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleCreateAnimal}
              className="bg-white/10 hover:bg-white/20"
            >
              Create
            </Button>
            <Button
              onClick={() => setShowCreateFields(false)}
              size="lg"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {searchValue && !showCreateFields && !selectedAnimal && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[300px] overflow-y-auto rounded-md border border-white/20 bg-black bg-black p-2">
          {searchResults?.length ? (
            searchResults.map((animal) => (
              <div
                onClick={() => handleSelectAnimal(animal)}
                key={animal.id}
                className="flex flex-col gap-1 rounded-md border border-white/10 p-3 text-sm text-white hover:bg-white/10"
              >
                <div className="font-medium">{animal.name}</div>
                <div className="text-xs text-white/70">
                  {animal.species}
                  {animal.yearOfBirth && ` • Born ${animal.yearOfBirth}`}
                  {animal.weight && ` • ${animal.weight}`}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-white/50">No animals found</div>
          )}
        </div>
      )}
    </div>
  );
}
