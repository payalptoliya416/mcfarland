export interface GeoResult {
  country?: string;
  country_code?: string;
}

export const getCountryFromAddress = async (
  address: string,
  city: string,
  state: string,
  zip: string
): Promise<GeoResult | null> => {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

  const fullAddress = `${address}, ${city}, ${state}, ${zip}`;

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    fullAddress
  )}&apiKey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data?.features?.length) return null;

  return {
    country: data.features[0].properties.country,
    country_code: data.features[0].properties.country_code?.toUpperCase(),
  };
};
