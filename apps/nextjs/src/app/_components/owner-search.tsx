"use client";

import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function OwnerSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCreateFields, setShowCreateFields] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ email: "", phone: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data: searchResults } = api.profile.search.useQuery(
    { query: debouncedSearch },
    {
      enabled: debouncedSearch.length > 0,
    },
  );

  const { mutate: createProfile } = api.profile.create.useMutation({
    onSuccess: (data) => {
      console.log("Profile created", data);
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
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

    const [firstName, lastName] = searchValue.split(" ");
    createProfile({
      first_name: firstName,
      last_name: lastName || "",
      email,
      mobile_number: phone,
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="owner-name" className="text-sm text-white">
            Owner Name
          </Label>
          <div className={`flex ${showCreateFields ? "" : "gap-2"}`}>
            <Input
              id="owner-name"
              type="text"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter full name"
              className="w-full border border-white/20 bg-black/50 text-white"
            />
            {!showCreateFields && (
              <Button
                onClick={handleCreateProfile}
                className="bg-white/10 hover:bg-white/20"
              >
                Create
              </Button>
            )}
          </div>
        </div>

        {showCreateFields && (
          <div className="flex flex-col gap-2">
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
                className={`w-full border border-white/20 bg-black/50 text-white ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="mt-1 text-xs text-red-500">{errors.email}</div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="owner-phone" className="text-sm text-white">
                Phone Number
              </Label>
              <Input
                id="owner-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className={`w-full border border-white/20 bg-black/50 text-white ${errors.phone ? "border-red-500" : ""}`}
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

      {searchValue && !showCreateFields && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-white/20 bg-black bg-black p-2">
          {searchResults?.length ? (
            searchResults.map((owner) => (
              <div
                key={owner.id}
                className="flex flex-col gap-1 rounded-md border border-white/10 p-3 text-sm text-white hover:bg-white/10"
              >
                <div className="font-medium">
                  {owner.firstName} {owner.lastName}
                </div>
                <div className="text-xs text-white/70">{owner.email}</div>
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
