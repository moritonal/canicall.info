export async function getTimezoneId(lat: number, lng: number): Promise<string> {
  const apiKey = import.meta.env.VITE_GOOGLE_TIMEZONE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_GOOGLE_TIMEZONE_API_KEY");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const target = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;

  const response = await fetch(target);
  if (!response.ok) {
    throw new Error(`Timezone lookup failed with status ${response.status}`);
  }

  const body = await response.json() as { status: string; timeZoneId?: string };

  if (body.status !== "OK" || !body.timeZoneId) {
    throw new Error("Timezone lookup did not return a valid timezone");
  }

  return body.timeZoneId;
}
