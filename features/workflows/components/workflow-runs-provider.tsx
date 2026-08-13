"use client"

import { createContext, useContext, useMemo } from "react"
import { useRealtimeRunsWithTag } from "@trigger.dev/react-hooks"
import type {
  RunStep,
  runWorkflowTask,
} from "@/features/workflows/tasks/run-workflow"

type WorkflowRun = ReturnType<
  typeof useRealtimeRunsWithTag<typeof runWorkflowTask>
>["runs"][number]

interface WorkflowRunsContextValue {
  runs: WorkflowRun[]
  error?: Error
}

const WorkflowRunsContext = createContext<WorkflowRunsContextValue | null>(null)

interface WorkflowRunsProviderProps {
  workflowId: string
  accessToken: string
  children: React.ReactNode
}

export function WorkflowRunsProvider({
  workflowId,
  accessToken,
  children,
}: WorkflowRunsProviderProps) {
  const { runs, error } = useRealtimeRunsWithTag<typeof runWorkflowTask>(
    `workflow:${workflowId}`,
    { accessToken }
  )

  const value = useMemo<WorkflowRunsContextValue>(
    () => ({ runs, error }),
    [runs, error]
  )

  return (
    <WorkflowRunsContext.Provider value={value}>
      {children}
    </WorkflowRunsContext.Provider>
  )
}

function useWorkflowRuns() {
  const ctx = useContext(WorkflowRunsContext)

  if (!ctx) {
    throw new Error(
      "useWorkflowRuns must be used within a WorkflowRunsProvider"
    )
  }
  return ctx
}

interface LatestRunSteps {
  steps: RunStep[]
  isLive: boolean
}

export function useLatestRunSteps(): LatestRunSteps {
  const { runs } = useWorkflowRuns()

  return useMemo<LatestRunSteps>(() => {
    const latest = runs.reduce<WorkflowRun | undefined>((newest, run) => {
      if (!newest || run.createdAt > newest.createdAt) {
        return run
      }
      return newest
    }, undefined)

    if (!latest) {
      return { steps: [], isLive: false }
    }

    const isLive = latest.status === "QUEUED" || latest.status === "EXECUTING"
    const metadataSteps = latest.metadata?.steps as RunStep[] | undefined
    const steps = latest.output?.steps ?? metadataSteps ?? []
    return { steps, isLive }
  }, [runs])
}
