"use client";

import { useEffect, useRef, useState } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface OwnerSearchProps {
  onSelect: (owner: Profile | null) => void;
}

type Profile = RouterOutputs["profile"]["search"][number];

export default function OwnerSearch({ onSelect }: OwnerSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCreateFields, setShowCreateFields] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [selectedOwner, setSelectedOwner] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only debounce if search is at least 2 chars
    if (searchValue.length < 2) {
      setDebouncedSearch("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 200); // Reduced from 300ms to 200ms

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (showCreateFields) {
      firstNameInputRef.current?.focus();
    }
  }, [showCreateFields]);

  const { data: searchResults } = api.profile.search.useQuery(
    { query: debouncedSearch },
    {
      enabled: debouncedSearch.length >= 2, // Only search with 2+ chars
      staleTime: 30000, // Cache results for 30 seconds
      gcTime: 60000, // Keep cache for 1 minute (renamed from cacheTime)
    },
  );

  const { mutate: createProfile } = api.profile.create.useMutation({
    onSuccess: (data) => {
      console.log("Profile created", data);
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (selectedOwner) {
      setSelectedOwner(null);
      onSelect(null);
    }
    if (showCreateFields) {
      setFirstName(value);
    }
  };

  const handleSelectOwner = (owner: Profile) => {
    setSelectedOwner(owner);
    setSearchValue(`${owner.firstName} ${owner.lastName}`);
    onSelect(owner);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleCreateProfile = () => {
    if (!showCreateFields) {
      setShowCreateFields(true);
      setFirstName(searchValue);
      setLastName("");
      return;
    }

    // Reset errors
    setErrors({ email: "", phone: "" });

    // Validate fields
    let hasErrors = false;

    if (email && !validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      hasErrors = true;
    }

    if (phone && !validatePhone(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    createProfile({
      first_name: firstName,
      last_name: lastName,
      email,
      mobile_number: phone,
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className={`flex ${showCreateFields ? "" : "gap-2"}`}>
            {selectedOwner ? (
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2 rounded-md border border-white/20 bg-black/50 p-2 text-white">
                  <div className="flex flex-1 flex-col">
                    <div>
                      {selectedOwner.firstName} {selectedOwner.lastName}
                    </div>
                    {selectedOwner.email && (
                      <div className="text-sm text-white/70">
                        {selectedOwner.email}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedOwner(null);
                      setSearchValue("");
                      onSelect(null);
                    }}
                    className="h-6 hover:bg-white/10"
                  >
                    ✕
                  </Button>
                </div>
                {selectedOwner.animals && (
                  <div className="flex flex-wrap gap-2">
                    {selectedOwner.animals.map((animal) => (
                      <Button
                        key={animal.id}
                        variant="outline"
                        size="sm"
                        className="min-w-[120px] flex-1"
                      >
                        {animal.name}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-[120px] flex-1"
                    >
                      + New Pet
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              !showCreateFields && (
                <>
                  <Input
                    id="owner-name"
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for owner by email, phone, or name"
                    className="w-full border border-white/20 bg-black/50 text-white focus:border-white/40"
                  />
                  {!showCreateFields &&
                    !selectedOwner &&
                    searchValue.length > 0 && (
                      <Button
                        onClick={handleCreateProfile}
                        className="bg-white/10 hover:bg-white/20"
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
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <Label
                  htmlFor="owner-first-name"
                  className="text-sm text-white"
                >
                  First Name
                </Label>
                <Input
                  ref={firstNameInputRef}
                  id="owner-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full border border-white/20 bg-black/50 text-white focus:border-white/40"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="owner-last-name" className="text-sm text-white">
                  Last Name
                </Label>
                <Input
                  id="owner-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full border border-white/20 bg-black/50 text-white focus:border-white/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="owner-email" className="text-sm text-white">
                Email Address
              </Label>
              <Input
                id="owner-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className={`w-full border border-white/20 bg-black/50 text-white focus:border-white/40 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="mt-1 text-xs text-red-500">{errors.email}</div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="owner-phone" className="text-xs text-white">
                Phone Number
              </Label>
              <Input
                id="owner-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className={`w-full border border-white/20 bg-black/50 text-white focus:border-white/40 focus-visible:outline-2 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <div className="mt-1 text-xs text-red-500">{errors.phone}</div>
              )}
            </div>
            <Button
              size="lg"
              onClick={handleCreateProfile}
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

      {searchValue && !showCreateFields && !selectedOwner && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[300px] overflow-y-auto rounded-md border border-white/20 bg-black bg-black p-2">
          {searchResults?.length ? (
            searchResults.map((owner) => (
              <div
                onClick={() => handleSelectOwner(owner)}
                key={owner.id}
                className="flex flex-col gap-1 rounded-md border border-white/10 p-3 text-sm text-white hover:bg-white/10"
              >
                <div className="font-medium">
                  {owner.firstName} {owner.lastName}
                </div>
                <div className="text-xs text-white/70">{owner.email}</div>
                {owner.animals?.length > 0 && (
                  <div className="text-xs text-white/70">
                    Pets: {owner.animals.map((a) => a.name).join(", ")}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-white/50">No owners found</div>
          )}
        </div>
      )}
    </div>
  );
}
