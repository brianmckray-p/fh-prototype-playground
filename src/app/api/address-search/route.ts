import { NextRequest, NextResponse } from "next/server";

const MOCK_SUGGESTIONS = [
  { street_line: "885 W 14750 S", city: "Bluffdale", state: "UT", zipcode: "84065" },
  { street_line: "1968 Madison Ridge Ln", city: "Salt Lake City", state: "UT", zipcode: "84121" },
  { street_line: "8547 S Rundstane Dr", city: "West Jordan", state: "UT", zipcode: "84081" },
  { street_line: "123 Maple St", city: "Springfield", state: "IL", zipcode: "62704" },
  { street_line: "456 Oak Ave", city: "Chicago", state: "IL", zipcode: "60601" },
  { street_line: "789 Pine Rd", city: "Austin", state: "TX", zipcode: "78701" },
  { street_line: "321 Elm St", city: "Denver", state: "CO", zipcode: "80201" },
];

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? "";
  if (search.length < 3) return NextResponse.json({ suggestions: [] });

  const authId = process.env.SMARTY_AUTH_ID;
  const authToken = process.env.SMARTY_AUTH_TOKEN;

  // Live Smarty Streets call when credentials are configured
  if (authId && authToken) {
    try {
      const url = new URL("https://us-autocomplete-pro.api.smartystreets.com/lookup");
      url.searchParams.set("auth-id", authId);
      url.searchParams.set("auth-token", authToken);
      url.searchParams.set("search", search);
      url.searchParams.set("source", "all");

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // fall through to mock
    }
  }

  // Mock fallback — fuzzy match on street line
  const q = search.toLowerCase();
  const suggestions = MOCK_SUGGESTIONS.filter(
    (s) =>
      s.street_line.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.zipcode.includes(q)
  );
  return NextResponse.json({ suggestions });
}
