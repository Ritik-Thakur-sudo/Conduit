import * as Sentry from "@sentry/node"

let initialized = false

export function initializeTriggerSentry() {
  if (initialized) {
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableLogs: true,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  })
  initialized = true
}

export function captureTriggerTaskFailure({
  payload,
  error,
  ctx,
}: {
  payload: unknown
  error: unknown
  ctx: {
    run: { id: string }
    task: { id: string }
  }
}) {
  initializeTriggerSentry()

  const workflowId =
    typeof payload === "object" &&
    payload !== null &&
    "workflowId" in payload &&
    typeof payload.workflowId === "string"
      ? payload.workflowId
      : undefined

  Sentry.withScope((scope) => {
    scope.setAttributes({
      taskId: ctx.task.id,
      triggerRunId: ctx.run.id,
      ...(workflowId ? { workflowId } : {}),
    })
    Sentry.captureException(error)
  })
}
