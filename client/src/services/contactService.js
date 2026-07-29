import { API_URL } from "./apiClient";

export const contactService = {
    sendMessage: async (contactData) => {
        const response = await fetch(`${API_URL}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to send contact message");
        return data;
    }
};
