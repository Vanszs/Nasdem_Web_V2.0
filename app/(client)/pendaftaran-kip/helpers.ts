import { KipFormData } from "./schema";
import { DRAFT_STORAGE_KEY, DRAFT_TIMESTAMP_KEY } from "./constants";

export const saveDraftToLocalStorage = (data: Partial<KipFormData>) => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(DRAFT_TIMESTAMP_KEY, new Date().toISOString());
    console.log("✅ Draft saved to localStorage");
  } catch (error) {
    console.error("❌ Failed to save draft:", error);
  }
};

export const loadDraftFromLocalStorage = (): Partial<KipFormData> | null => {
  try {
    const draftData = localStorage.getItem(DRAFT_STORAGE_KEY);
    const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);

    if (draftData && timestamp) {
      const savedTime = new Date(timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);

      // Hapus draft jika lebih dari 7 hari
      if (hoursDiff > 168) {
        clearDraft();
        return null;
      }

      return JSON.parse(draftData);
    }
  } catch (error) {
    console.error("❌ Failed to load draft:", error);
  }
  return null;
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    console.log("🗑️ Draft cleared from localStorage");
  } catch (error) {
    console.error("❌ Failed to clear draft:", error);
  }
};

export const getDraftTimestamp = (): string | null => {
  try {
    const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
    if (timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  } catch (error) {
    console.error("❌ Failed to get timestamp:", error);
  }
  return null;
};
