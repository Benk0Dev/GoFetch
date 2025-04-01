import { IPet } from "@gofetch/models/IPet";

import { API_URL } from "@client/services/Registry";

export async function addPetForUser(userId: number, pet: IPet) {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/pet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pet)
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function removePetForUser(petId: number) {
  try {
    const response = await fetch(`${API_URL}/removePet/${petId}`, {
      method: "DELETE"
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}