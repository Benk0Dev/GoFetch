const GOOGLE_API_KEY = "AIzaSyCiCKqjVuYYuOSM-SgIYHAprSyyaPFgA9M";

import { IAddress } from "@gofetch/models/IUser";

// Load Google Places API script dynamically
export const loadGooglePlacesScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google) return resolve(); // already loaded
  
      const existingScript = document.querySelector("script[src*='maps.googleapis.com/maps/api/js']");
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        return;
      }
  
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject("Failed to load Google Maps script");
      document.body.appendChild(script);
    });
  };
  

// Geocode the address to get more details (like city, country, etc.)
export const geocodeAddress = async (address: string): Promise<google.maps.GeocoderResult[]> => {
  const google = window.google;
  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        resolve(results);
      } else {
        reject("Address could not be geocoded.");
      }
    });
  });
};

// Helper to convert IAddress to a single line string
export const formatAddress = (address: IAddress): string => {
  return `${address.street}, ${address.city}, ${address.postcode}, ${address.country}`;
};

// Get coordinates from IAddress
export const getCoordinatesFromIAddress = async (address: IAddress): Promise<{ lat: number; lng: number }> => {
  const results = await geocodeAddress(formatAddress(address));
  const location = results[0].geometry.location;
  return {
    lat: location.lat(),
    lng: location.lng(),
  };
};

// Get distance in meters between two addresses
export const getDistanceBetweenAddresses = async (
  origin: IAddress,
  destination: IAddress
): Promise<number> => {
  const google = window.google;
  const service = new google.maps.DistanceMatrixService();

  const originFormatted = formatAddress(origin);
  const destinationFormatted = formatAddress(destination);

  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [originFormatted],
        destinations: [destinationFormatted],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === "OK") {
          const element = response.rows[0].elements[0];
          if (element.status === "OK") {
            resolve(element.distance.value); // in meters
          } else {
            reject("Could not calculate distance between addresses.");
          }
        } else {
          reject("DistanceMatrixService failed.");
        }
      }
    );
  });
};
