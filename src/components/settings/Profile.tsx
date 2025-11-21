"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileSettingsProps {}

const ProfileSettings: React.FC<ProfileSettingsProps> = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileData>({ firstName: "", lastName: "", email: "" });
  const [editedProfile, setEditedProfile] = useState<ProfileData>({ firstName: "", lastName: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [idUser, setIdUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedProfile = localStorage.getItem("profile");

    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    setIdUser(parsedUser.id_user);

    const profileData = storedProfile ? JSON.parse(storedProfile) : {};
    const loadedProfile = {
      firstName: profileData.first_name || "",
      lastName: profileData.last_name || "",
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
    setFeedback(null);

    try {
      // Save to localStorage
      localStorage.setItem(
        "profile",
        JSON.stringify({ first_name: editedProfile.firstName, last_name: editedProfile.lastName })
      );

      setProfile(editedProfile);
      setFeedback(t("changes_saved") || "Changes saved locally");

      // Save via API
      const res = await fetch(`/api/profile?id=${idUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: editedProfile.firstName,
          last_name: editedProfile.lastName,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to save remotely");

      setFeedback(t("changes_saved") || "Changes saved successfully");
    } catch (err: any) {
      setFeedback(err.message || "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = editedProfile.firstName !== profile.firstName || editedProfile.lastName !== profile.lastName;

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{t("profile_settings")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">{t("first_name")}</label>
          <input
            type="text"
            value={editedProfile.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">{t("last_name")}</label>
          <input
            type="text"
            value={editedProfile.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">{t("email")}</label>
        <input
          type="text"
          value={editedProfile.email}
          disabled
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
        />
      </div>

      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? t("saving") || "Saving..." : t("save_changes") || "Save changes"}
        </button>
      )}

      {feedback && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{feedback}</p>}
    </section>
  );
};

export default ProfileSettings;
