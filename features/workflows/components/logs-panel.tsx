"use client"

import prettyMilliseconds from "pretty-ms"
import { cn } from "@/lib/utils"
import { NodeIcon } from "@/features/workflows/components/node-icon"
import {
  useConsoleRuns,
  type ConsoleRun,
} from "@/features/workflows/components/workflow-runs-provider"
import type { RunStep } from "@/features/workflows/tasks/run-workflow"

export interface StepSelection {
  runId: string
  nodeId: string
}

function StepRow({
  run,
  step,
  isSelected,
  onSelect,
}: {
  run: ConsoleRun
  step: RunStep
  isSelected: boolean
  onSelect: (selection: StepSelection) => void
}) {
  const isRunning = step.status === "running" && run.isLive
  const isFailed = step.status === "failed"
  const isInactive = step.status === "pending"

  return (
    <button
      type="button"
      onClick={() => onSelect({ runId: run.id, nodeId: step.nodeId })}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-accent",
        isSelected && "bg-accent",
        isInactive && "opacity-50"
      )}
    >
      <NodeIcon type={step.type} running={isRunning} />
      <span
        className={cn("truncate font-medium", isFailed && "text-destructive")}
      >
        {step.title}
      </span>
      {step.durationMs != null && (
        <span className="ml-auto shrink-0 text-muted-foreground tabular-nums">
          {prettyMilliseconds(step.durationMs)}
        </span>
      )}
    </button>
  )
}

export function LogsPanel({
  selected,
  onSelectStep,
}: {
  selected: StepSelection | null
  onSelectStep: (selection: StepSelection) => void
}) {
  const runs = useConsoleRuns()

  if (runs.length === 0) {
    return (
      <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
        No runs yet
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col gap-3 overflow-y-auto p-2">
      {runs.map((run) => (
        <div key={run.id} className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
            <span>{run.createdAt.toLocaleTimeString()}</span>
            <span className="lowercase">{run.status}</span>
          </div>
          {run.steps.map((step) => (
            <StepRow
              key={step.nodeId}
              run={run}
              step={step}
              isSelected={
                selected?.runId === run.id && selected.nodeId === step.nodeId
              }
              onSelect={onSelectStep}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
