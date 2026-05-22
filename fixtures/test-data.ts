export const ratingLabels = [
  "Equipment quality",
  "Customer service",
  "Technical support",
  "After-sales support",
  "Value for money",
] as const;

export const testData = {
  catalogueSearchTerm: "drill",
  validReview: () => {
    const timestamp = Date.now();
    return {
      reviewerName: "Playwright QA",
      reviewerEmail: `playwright.qa+${timestamp}@example.com`,
      reviewText:
        `Automated QA review created at ${new Date(timestamp).toISOString()} for moderation workflow validation.`,
      rating: 5,
    };
  },
};
