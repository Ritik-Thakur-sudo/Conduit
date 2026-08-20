import { defineConfig } from "@trigger.dev/sdk"
import { esbuildPlugin } from "@trigger.dev/build/extensions"
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin"
import {
  captureTriggerTaskFailure,
  initializeTriggerSentry,
} from "./features/workflows/tasks/sentry"

const hasSentrySourceMapConfiguration = Boolean(
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT
)

export default defineConfig({
  project: "proj_qcbnyjekgqjxerfbudxz",
  runtime: "node",
  logLevel: "log",
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["features"],
  init: async () => {
    initializeTriggerSentry()
  },
  onFailure: async ({ payload, error, ctx }) => {
    captureTriggerTaskFailure({ payload, error, ctx })
  },
  build: {
    extensions: hasSentrySourceMapConfiguration
      ? [
          esbuildPlugin(
            sentryEsbuildPlugin({
              authToken: process.env.SENTRY_AUTH_TOKEN,
              org: process.env.SENTRY_ORG,
              project: process.env.SENTRY_PROJECT,
            }),
            { placement: "last", target: "deploy" }
          ),
        ]
      : [],
  },
})
