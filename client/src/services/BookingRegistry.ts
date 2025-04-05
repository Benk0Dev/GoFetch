import { BookingStatus, IBooking, INewBooking } from "@gofetch/models/IBooking";
import { editUser, getUserById } from "@client/services/UserRegistry";

import { API_URL } from "@client/services/Registry";

export const createBooking = async (bookingData: INewBooking) => {
  try {
    const response = await fetch(`${API_URL}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData)
    });
    if (response.ok) {
      const booking = await response.json();

      const minder = await getUserById(booking.minderId);

      const editMinder = await editUser(booking.minderId, {
        minderRoleInfo: {
          bookingIds: [booking.id, ...minder.minderRoleInfo.bookings.map((b: IBooking) => b.id)],
        }
      });

      if (!editMinder) {
        return null;
      }

      const petOwner = await getUserById(booking.ownerId);

      const editOwner = await editUser(booking.ownerId, {
        ownerRoleInfo: {
          bookingIds: [booking.id, ...petOwner.ownerRoleInfo.bookings.map((b: IBooking) => b.id)],
        }
      });

      if (!editOwner) {
        return null;
      }

      return booking;
    } else {
      const text = await response.text();
      console.error(text);
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export async function setBookingStatus(bookingId: number, status: BookingStatus) {
  try {
    const response = await fetch(`${API_URL}/booking/${bookingId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      const booking = await response.json();
      return booking;
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


export async function getBooking(bookingId: number) {
    try {
        const response = await fetch(`${API_URL}/booking/${bookingId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const booking = await response.json();
            console.log(booking);
            return booking;
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