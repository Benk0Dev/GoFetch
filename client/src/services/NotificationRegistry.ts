import { getUserId } from "@client/utils/StorageManager";

import { API_URL } from "@client/services/Registry";

export async function getUserNotifications() {
  try {
    const userId = getUserId();
    if (!userId) {
      return { notifications: [] };
    }

    const response = await fetch(`${API_URL}/notifications/${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const text = await response.text();
      console.error(text);
      return { notifications: [] };
    }
  } catch (e) {
    console.error(e);
    return { notifications: [] };
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PUT"
    });
    if (response.ok) {
      const data = await response.json();
      return data.notification;
    } else {
      const text = await response.text();
      console.error(text);
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createNotification(notification: { userId: number, message: string, type: string, link: string }) {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification)
    });
    if (response.ok) {
      const data = await response.json();
      return data.notification;
    } else {
      const text = await response.text();
      console.error(text);
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}