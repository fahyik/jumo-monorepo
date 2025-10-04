const openFoodFactsUrl =
  process.env.APP_ENV !== "production"
    ? "https://world.openfoodfacts.net"
    : "https://world.openfoodfacts.org";

export async function getFoods({
  search,
  page,
  pageSize = 10,
}: {
  search: string;
  page?: number;
  pageSize?: number;
}) {
  const url = new URL(`${openFoodFactsUrl}/cgi/search.pl`);
  url.searchParams.set("search_terms2", search);
  url.searchParams.set("search_simple", "1");
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("sort_by", "unique_scans_n");
  if (page !== undefined) {
    url.searchParams.set("page", page.toString());
  }
  if (pageSize !== undefined) {
    url.searchParams.set("page_size", pageSize.toString());
  }

  const response = await fetch(url.toString());
  return response.json();
}
