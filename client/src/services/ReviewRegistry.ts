import { IReview } from "@gofetch/models/IReview";

import { API_URL } from "@client/services/Registry";

export async function addReviewForUser(userId: number, review: IReview) {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review)
    });
    if (response.ok) {
      const review = await response.json();
      return review;
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

export async function getReviewById(reviewId: number) {
  try {
    const response = await fetch(`${API_URL}/review/${reviewId}`);
    if (response.ok) {
      const review = await response.json();
      return review;
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