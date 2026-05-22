import { expect, request as playwrightRequest, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";

type Category = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  toolCount: number;
};

type PagedList<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

type ToolSummary = {
  id: number;
  name: string;
  categoryName: string;
  startingPrice: number;
  startingPriceUnit: string;
  dailyRate: number;
  overallRating: number | null;
  reviewCount: number;
  hasEnoughReviewsToRate: boolean;
  ratingMessage: string | null;
  thumbnailUrl: string | null;
};

test.describe("Catalogue API", () => {
  test.skip(!env.apiBaseUrl, skipMessages.apiBaseUrl);

  test("serves category, tool detail, review listing, and rental calculation endpoints", async () => {
    const api = await playwrightRequest.newContext({
      baseURL: `${env.apiBaseUrl}/`,
    });

    try {
      const categoriesResponse = await api.get("categories");
      expect(categoriesResponse.ok()).toBeTruthy();

      const categories = (await categoriesResponse.json()) as Category[];
      expect(Array.isArray(categories)).toBeTruthy();

      test.skip(
        categories.length === 0,
        "The configured API returned no categories to exercise."
      );

      const firstCategory = categories[0];
      expect(firstCategory.id).toEqual(expect.any(Number));
      expect(firstCategory.name).toEqual(expect.any(String));

      const featuredResponse = await api.get("categories/featured");
      expect(featuredResponse.ok()).toBeTruthy();
      expect(Array.isArray(await featuredResponse.json())).toBeTruthy();

      const categoryToolsResponse = await api.get(
        `categories/${firstCategory.id}/tools`,
        {
          params: {
            page: "1",
            pageSize: "5",
            sortBy: "rating_desc",
          },
        }
      );
      expect(categoryToolsResponse.ok()).toBeTruthy();

      const categoryTools =
        (await categoryToolsResponse.json()) as PagedList<ToolSummary>;
      expect(Array.isArray(categoryTools.items)).toBeTruthy();
      expect(categoryTools.page).toBe(1);
      expect(categoryTools.pageSize).toBe(5);

      test.skip(
        categoryTools.items.length === 0,
        "The configured API returned no tools for the first category."
      );

      const firstTool = categoryTools.items[0];
      expect(firstTool.id).toEqual(expect.any(Number));
      expect(firstTool.name).toEqual(expect.any(String));

      const toolDetailsResponse = await api.get(`tools/${firstTool.id}`);
      expect(toolDetailsResponse.ok()).toBeTruthy();
      const toolDetails = await toolDetailsResponse.json();
      expect(toolDetails).toEqual(
        expect.objectContaining({
          id: firstTool.id,
          name: firstTool.name,
        })
      );

      const searchResponse = await api.get("tools/search", {
        params: {
          q: firstTool.name.split(" ")[0],
          page: "1",
          pageSize: "5",
        },
      });
      expect(searchResponse.ok()).toBeTruthy();
      const searchResults = (await searchResponse.json()) as PagedList<ToolSummary>;
      expect(Array.isArray(searchResults.items)).toBeTruthy();

      const reviewsResponse = await api.get(`tools/${firstTool.id}/reviews`, {
        params: {
          page: "1",
          pageSize: "5",
        },
      });
      expect(reviewsResponse.ok()).toBeTruthy();
      const reviews = await reviewsResponse.json();
      expect(reviews).toEqual(
        expect.objectContaining({
          toolId: firstTool.id,
          reviews: expect.objectContaining({
            items: expect.any(Array),
          }),
        })
      );

      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      const rentalResponse = await api.post(
        `tools/${firstTool.id}/rental-calculation`,
        {
          data: {
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString(),
          },
        }
      );
      expect(rentalResponse.ok()).toBeTruthy();
      const rentalCalculation = await rentalResponse.json();
      expect(rentalCalculation).toEqual(
        expect.objectContaining({
          toolName: expect.any(String),
          totalCost: expect.any(Number),
        })
      );
    } finally {
      await api.dispose();
    }
  });
});
