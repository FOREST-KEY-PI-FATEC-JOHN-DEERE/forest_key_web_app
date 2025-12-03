"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showSuccess, showError } from "@/utils/toast";
import SuccessModal from "@/components/SuccessModal";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
}

interface ProfileSettingsProps {}

const ProfileSettings: React.FC<ProfileSettingsProps> = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileData>({ first_name: "", last_name: "", email: "" });
  const [editedProfile, setEditedProfile] = useState<ProfileData>({ first_name: "", last_name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [idUser, setIdUser] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [successModalVariant, setSuccessModalVariant] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedProfile = localStorage.getItem("profile");

    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setIdUser(parsedUser.id);

    const profileData = storedProfile ? JSON.parse(storedProfile) : {};
    const loadedProfile = {
      first_name: profileData.first_name || "",
      last_name: profileData.last_name || "",
      email: parsedUser.email,
    };

    setProfile(loadedProfile);
    setEditedProfile(loadedProfile);
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Save to localStorage
      localStorage.setItem(
        "profile",
        JSON.stringify({ first_name: editedProfile.first_name, last_name: editedProfile.last_name })
      );

      setProfile(editedProfile);

      // Save via API
      const res = await fetch(`/api/profile?id=${idUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to save remotely");

      setSuccessModalVariant('success');
      setSuccessModalMessage(t("changes_saved") || "Changes saved successfully");
      setSuccessModalOpen(true);
    } catch (err: any) {
      setSuccessModalVariant('error');
      setSuccessModalMessage(err.message || "Error saving changes");
      setSuccessModalOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = editedProfile.first_name !== profile.first_name || editedProfile.last_name !== profile.last_name;

  return (
    <section className="bg-[var(--color-card)] p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{t("profile_settings")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">{t("first_name")}</label>
          <input
            type="text"
            value={editedProfile.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">{t("last_name")}</label>
          <input
            type="text"
            value={editedProfile.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">{t("email")}</label>
        <input
          type="text"
          value={editedProfile.email}
          disabled
          className="w-full px-4 py-2 border rounded-lg  cursor-not-allowed"
        />
      </div>

      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600  rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? t("saving") || "Saving..." : t("save_changes") || "Save changes"}
        </button>
      )}

        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          message={successModalMessage}
          showOkButton={true}
          variant={successModalVariant}
        />

    </section>
  );
};

export default ProfileSettings;
