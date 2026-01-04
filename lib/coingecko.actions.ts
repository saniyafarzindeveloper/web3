"use server"; //because its only being called from the server

//abstraction of API endpoints
import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("Could not get base URL");
if (!API_KEY) throw new Error("Could not get API key");

//function to export different API endpoints
export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    {
      skipEmptyString: true,
      skipNull: true,
    }
  );

  //calling the api end point
  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": API_KEY,
      "Content-type": "application/json",
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      `API error: ${response.status} : ${
        errorBody.error || response.statusText
      }`
    );
  }

  //if response is okay
  return response.json();
}
