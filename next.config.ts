import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "standalone",
}

export default withSentryConfig(nextConfig, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: process.env.CI ? true : process.env.NODE_ENV !== "development",
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
})
