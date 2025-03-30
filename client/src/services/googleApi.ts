const GOOGLE_API_KEY = "AIzaSyCiCKqjVuYYuOSM-SgIYHAprSyyaPFgA9M";

// Load Google Places API script dynamically
export const loadGooglePlacesScript = (): void => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
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