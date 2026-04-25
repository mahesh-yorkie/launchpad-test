/**
 * Single E2E entry: every spec in this tree is side-effect registered with Playwright.
 * Run: `npx playwright test automation-tests/index.ts` or `npm run test:e2e`.
 */
import './src/pages/Login.accessibility.spec'
import './src/pages/Login.api.spec'
import './src/pages/Login.edge.spec'
import './src/pages/Login.error.spec'
import './src/pages/Login.form.spec'
import './src/pages/Login.mobile.spec'
import './src/pages/Login.smoke.spec'
import './src/pages/Login.ui.spec'
