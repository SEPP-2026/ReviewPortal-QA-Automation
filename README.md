# ReviewPortal QA Automation

Playwright TypeScript automation framework for the Shelton Tool-Hire ReviewPortal system.

This project is independent from `ReviewPortal-Web` and `ReviewPortal-API`. It reads configured URLs from environment variables and does not hard-code local, DEV, UAT, or PROD hosts in the test code.

## Application Coverage

The framework was created after inspecting the application repositories.

Web routes and flows covered:

- `/` home page
- `/equipment` equipment catalogue loading, search, sort, available-only filter, and first-card navigation
- `/equipment/[id]` tool details, rental calculator period controls, booking request modal validation, and review form presence
- `/services`, `/pricing`, `/contact`, `/calculator`, `/reviews`
- `/contact` client-side contact form acknowledgement
- `/login`, `/register`, `/forgot-password`, `/reset-password` page loading and validation checks
- `/account/reviews` and `/account/change-password` authenticated account pages
- `/admin`, `/admin/moderation`, `/admin/bookings`, `/admin/tools`, `/admin/categories` read-only admin console coverage
- `/login?next=/admin` guarded admin login flow

API routes covered:

- `GET /api/categories`
- `GET /api/categories/featured`
- `GET /api/categories/{id}/tools`
- `GET /api/tools/search`
- `GET /api/tools/{id}`
- `GET /api/tools/{id}/reviews`
- `POST /api/tools/{id}/rental-calculation`

The suite deliberately avoids destructive admin actions such as create, edit, delete, approve, reject, password change, and status changes. Review submission is available but disabled by default because it creates pending moderation data.

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

Run all Web UI tests:

```powershell
npm run test:web
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

When a test fails, Playwright writes failure evidence to:

```text
test-results/
```

Depending on the failure, this can include:

- `test-failed-1.png` screenshot
- `video.webm` failure video
- `error-context.md` accessibility snapshot and failure details

To inspect the full report locally:

```powershell
npx playwright show-report
```

In the report:

1. Open the failed test.
2. Read the error message and call log.
3. Open the screenshot to see the final page state.
4. Open the video to replay the browser actions.
5. If the failure happened on retry in CI, inspect the trace attachment if present.

## Test Safety

- UI and API tests skip when their required base URLs are not configured.
- Admin login skips when `ADMIN_EMAIL` or `ADMIN_PASSWORD` is missing.
- Review submission is additive and creates a pending moderation item, so it only runs when `RUN_REVIEW_SUBMISSION=true`.
- API tests use public catalogue and calculation endpoints only. They do not create, update, or delete catalogue data.

## GitHub Actions

The workflow lives at `.github/workflows/playwright.yml` and runs on:

- `push` to `development`
- `pull_request` targeting `main`
- `push` to `main`
- manual `workflow_dispatch`
- cross-repository `repository_dispatch` from `ReviewPortal-Web`
- cross-repository `repository_dispatch` from `ReviewPortal-API`

Recommended branch flow:

```powershell
git checkout -b development
git add .
git commit -m "Update QA automation"
git push -u origin development
```

Open a pull request from `development` into `main`. The QA workflow will run on the pull request before merge, and again when the merge lands on `main`.

Manual runs from the GitHub Actions tab support:

- `test_suite`: `all`, `web`, `smoke`, `e2e`, or `api`
- `web_base_url`: optional one-run `WEB_BASE_URL` override
- `api_base_url`: optional one-run `API_BASE_URL` override
- `run_review_submission`: set to `true` only when the target environment can accept pending review test data

The workflow installs Node.js, runs `npm ci`, installs Playwright browsers with system dependencies, type-checks the project, runs the selected Playwright suite, and uploads both `playwright-report` and `test-results`.

To view GitHub Actions reports:

1. Open the QA automation repository in GitHub.
2. Go to **Actions**.
3. Open the workflow run.
4. Scroll to **Artifacts**.
5. Download `playwright-report` for the HTML report.
6. Download `test-results` for screenshots, videos, and failure context.

After downloading `playwright-report`, unzip it and open `index.html` in a browser.

Configure these GitHub repository secrets or variables before running against a real environment:

| Name | Recommended storage | Purpose |
|------|---------------------|---------|
| `WEB_BASE_URL` | Variable or secret | Target ReviewPortal-Web URL |
| `API_BASE_URL` | Variable or secret | Target ReviewPortal-API URL |
| `ADMIN_EMAIL` | Secret | Admin login email for guarded admin tests |
| `ADMIN_PASSWORD` | Secret | Admin login password for guarded admin tests |
| `RUN_REVIEW_SUBMISSION` | Variable | Optional default for additive review test |

If URLs or admin credentials are missing, the affected tests skip safely.

### Why did GitHub Actions show 29 skipped tests?

GitHub Actions does not read your local `.env` file. If `WEB_BASE_URL` and
`API_BASE_URL` are not configured in GitHub, every Web/API test safely skips and
the HTML report can look empty except for the skipped count.

For automated branch runs, add repository variables:

```text
WEB_BASE_URL=https://reviewportal-frontend-dccvarataff4a8hg.southeastasia-01.azurewebsites.net
API_BASE_URL=https://reviewportal-api-escdb3f2epg8eeha.southeastasia-01.azurewebsites.net
```

Add repository secrets:

```text
ADMIN_EMAIL=admin.test@reviewportal.local
ADMIN_PASSWORD=Admin123!
```

For manual workflow runs, you can also type `web_base_url` and `api_base_url`
directly into the **Run workflow** form.

## Cross-Repository Automation

`ReviewPortal-Web` and `ReviewPortal-API` can trigger this QA suite without
copying Playwright tests into those repositories.

Source repositories contain only a small dispatch workflow:

- `ReviewPortal-Web/.github/workflows/trigger-qa-automation.yml`
- `ReviewPortal-API/.github/workflows/trigger-qa-automation.yml`

Those workflows run on:

- `push` to `development`
- `push` to `develop`
- `pull_request` targeting `development`
- `pull_request` targeting `develop`
- manual `workflow_dispatch`

They send `repository_dispatch` events to this QA repository:

- `reviewportal-web-development`
- `reviewportal-api-development`

This QA repository receives the event, runs the configured Playwright suite,
uploads `playwright-report` and `test-results`, and can optionally write a
commit status back to the Web/API commit.

### Required Cross-Repo Secret

Create this secret in both source repositories:

```text
QA_AUTOMATION_TRIGGER_TOKEN
```

The token must be able to create a repository dispatch event in:

```text
SEPP-2026/-ReviewPortal-QA-Automation
```

Recommended fine-grained token permissions:

- Target repository: `SEPP-2026/-ReviewPortal-QA-Automation`
- Repository permission: `Contents: Read and write`
- Metadata: read-only, included automatically

For a classic token, use `repo` for private repositories or `public_repo` for
public repositories.

### Optional Commit Status Callback

If you want the Web/API commit or pull request to show a status named
`QA Automation / Playwright`, create this secret in the QA automation repository:

```text
QA_AUTOMATION_STATUS_TOKEN
```

Recommended fine-grained token permissions:

- Source repositories: `SEPP-2026/ReviewPortal-Web` and `SEPP-2026/ReviewPortal-API`
- Repository permission: `Commit statuses: Read and write`
- Metadata: read-only, included automatically

Without this optional token, the QA workflow still runs; it just will not write
the pass/fail status back to the Web/API commit.

### Important Environment Note

The QA tests run against the URLs configured in this QA repository:

```text
WEB_BASE_URL
API_BASE_URL
```

If those URLs point to production, then a Web/API development branch push will
trigger tests against production. To test development branch changes before
production, deploy Web/API development branches to a dev or staging environment
and set these variables to those dev/staging URLs.
