interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function getCoordinates(location: string): Promise<GeocodeResult> {
  const apiKey = import.meta.env.VITE_GOOGLE_GEOCODE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_GOOGLE_GEOCODE_API_KEY");
  }

  const target = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
  const response = await fetch(target);

  if (!response.ok) {
    throw new Error(`Geocode lookup failed with status ${response.status}`);
  }

  const body = await response.json() as {
    status: string;
    results?: Array<{ geometry: { location: GeocodeResult } }>;
  };

  if (body.status !== "OK" || !body.results?.length) {
    throw new Error("No matching locations found");
  }

  return body.results[0].geometry.location;
}
