import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

const trimValue = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const trimTrailingSlash = (value?: string) => {
  const trimmed = trimValue(value);
  return trimmed?.replace(/\/+$/, "");
};

const normalizeApiBaseUrl = (value?: string) => {
  const baseUrl = trimTrailingSlash(value);
  if (!baseUrl) return undefined;
  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
};

const toBoolean = (value?: string) => trimValue(value)?.toLowerCase() === "true";

export const env = {
  webBaseUrl: trimTrailingSlash(process.env.WEB_BASE_URL),
  apiBaseUrl: normalizeApiBaseUrl(process.env.API_BASE_URL),
  adminEmail: trimValue(process.env.ADMIN_EMAIL),
  adminPassword: trimValue(process.env.ADMIN_PASSWORD),
  runReviewSubmission: toBoolean(process.env.RUN_REVIEW_SUBMISSION),
  ci: toBoolean(process.env.CI),
};

export const skipMessages = {
  webBaseUrl:
    "WEB_BASE_URL is not configured. Copy .env.example to .env and point it at the running ReviewPortal-Web app.",
  apiBaseUrl:
    "API_BASE_URL is not configured. Copy .env.example to .env and point it at the running ReviewPortal-API app.",
  adminCredentials:
    "ADMIN_EMAIL and ADMIN_PASSWORD are required for the admin login test.",
  reviewSubmission:
    "Review submission creates pending moderation data, so this test only runs when RUN_REVIEW_SUBMISSION=true.",
};
