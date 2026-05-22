# ReviewPortal QA Automation

Playwright TypeScript automation framework for the Shelton Tool-Hire ReviewPortal system.

This project is independent from `ReviewPortal-Web` and `ReviewPortal-API`. It reads configured URLs from environment variables and does not hard-code local, DEV, UAT, or PROD hosts in the test code.

## Application Coverage

The framework was created after inspecting the application repositories.

Web routes covered:

- `/` home page
- `/equipment` equipment catalogue
- `/equipment/[id]` tool details, rental calculator, and review form
- `/login?next=/admin` guarded admin login flow
- `/admin` and `/admin/moderation` staff console landing pages

API routes covered:

- `GET /api/categories`
- `GET /api/categories/featured`
- `GET /api/categories/{id}/tools`
- `GET /api/tools/search`
- `GET /api/tools/{id}`
- `GET /api/tools/{id}/reviews`
- `POST /api/tools/{id}/rental-calculation`

## Setup

Install dependencies:

```powershell
npm install
```

Install Playwright browsers:

```powershell
npx playwright install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Configure `.env`:

```env
WEB_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000
ADMIN_EMAIL=
ADMIN_PASSWORD=
RUN_REVIEW_SUBMISSION=false
```

`API_BASE_URL` can be set either to the host root or directly to `/api`; the test config normalizes it to the API base path.

## Running Tests

Run all tests:

```powershell
npm test
```

Run smoke tests only:

```powershell
npm run test:smoke
```

Run E2E tests:

```powershell
npm run test:e2e
```

Run API tests:

```powershell
npm run test:api
```

Run headed:

```powershell
npm run test:headed
```

Open Playwright UI mode:

```powershell
npm run test:ui
```

Open the HTML report:

```powershell
npm run report
```

## Test Safety

- UI and API tests skip when their required base URLs are not configured.
- Admin login skips when `ADMIN_EMAIL` or `ADMIN_PASSWORD` is missing.
- Review submission is additive and creates a pending moderation item, so it only runs when `RUN_REVIEW_SUBMISSION=true`.
- API tests use public catalogue and calculation endpoints only. They do not create, update, or delete catalogue data.

## GitHub Actions

The workflow lives at `.github/workflows/playwright.yml` and runs on:

- `pull_request`
- `workflow_dispatch`

Manual runs from the GitHub Actions tab support:

- `test_suite`: `all`, `smoke`, `e2e`, or `api`
- `web_base_url`: optional one-run `WEB_BASE_URL` override
- `api_base_url`: optional one-run `API_BASE_URL` override
- `run_review_submission`: set to `true` only when the target environment can accept pending review test data

The workflow installs Node.js, runs `npm ci`, installs Playwright browsers with system dependencies, type-checks the project, runs the selected Playwright suite, and uploads both `playwright-report` and `test-results`.

Configure these GitHub repository secrets or variables before running against a real environment:

| Name | Recommended storage | Purpose |
|------|---------------------|---------|
| `WEB_BASE_URL` | Variable or secret | Target ReviewPortal-Web URL |
| `API_BASE_URL` | Variable or secret | Target ReviewPortal-API URL |
| `ADMIN_EMAIL` | Secret | Admin login email for guarded admin tests |
| `ADMIN_PASSWORD` | Secret | Admin login password for guarded admin tests |
| `RUN_REVIEW_SUBMISSION` | Variable | Optional default for additive review test |

If URLs or admin credentials are missing, the affected tests skip safely.
