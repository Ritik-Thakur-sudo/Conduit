"use client"

import { useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { InspectorPanel } from "@/features/workflows/components/inspector-panel"
import {
  LogsPanel,
  type StepSelection,
} from "@/features/workflows/components/logs-panel"

export function ConsolePanel() {
  const [selected, setSelected] = useState<StepSelection | null>(null)

  const toggle = (selection: StepSelection) => {
    setSelected((prev) =>
      prev && prev.runId === selection.runId && prev.nodeId === selection.nodeId
        ? null
        : selection
    )
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="size-full">
      <ResizablePanel minSize="12rem">
        <LogsPanel selected={selected} onSelectStep={toggle} />
      </ResizablePanel>
      {selected && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="20rem" minSize="12rem">
            <InspectorPanel selection={selected} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
