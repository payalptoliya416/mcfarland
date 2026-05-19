export const getLatLngFromCity = async (
  city: string
) => {

  try {

    const apiKey =
      process.env
        .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city
      )}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();
    if (
      data.status !== "OK" ||
      !data.results?.length
    ) {
      throw new Error(
        `Location not found for ${city}`
      );

    }

    const location =
      data.results[0]
        .geometry.location;
    return {

      lat: location.lat,

      lng: location.lng,

    };

  } catch (error) {

    console.log(
      "GOOGLE MAP ERROR:",
      error
    );

    throw error;

  }

};