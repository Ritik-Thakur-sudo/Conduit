"use server"

import { auth } from "@clerk/nextjs/server"
import * as Sentry from "@sentry/nextjs"
import { runs, tasks } from "@trigger.dev/sdk"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { runWorkflowTask } from "@/features/workflows/tasks/run-workflow"
import { liveblocks } from "@/lib/liveblocks"
import {
  createWorkflow,
  deleteWorkflow,
  saveWorkflowGraph,
} from "@/features/workflows/data"
import { WorkflowGraph } from "@/lib/db/schema"

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()
  const scope = Sentry.getIsolationScope()
  scope.setAttributes({ action: "createWorkflowAction" })

  if (!orgId) {
    throw new Error("No active organization")
  }

  scope.setAttributes({ orgId })
  const workflow = await createWorkflow(orgId, name)
  scope.setAttributes({ workflowId: workflow.id })
  Sentry.logger.info("Workflow created", { action: "createWorkflowAction" })
  revalidatePath("/workflows", "layout")
  redirect(`/workflows/${workflow.id}`)
}

export async function deleteWorkflowAction(id: string) {
  const { orgId } = await auth()
  const scope = Sentry.getIsolationScope()
  scope.setAttributes({ action: "deleteWorkflowAction", workflowId: id })

  if (!orgId) {
    throw new Error("No active organization")
  }

  scope.setAttributes({ orgId })
  const workflow = await deleteWorkflow(orgId, id)

  if (!workflow) {
    Sentry.logger.warn(
      "Workflow deletion failed because workflow was not found",
      {
        action: "deleteWorkflowAction",
      }
    )
    throw new Error("Workflow not found")
  }

  // The workflow id doubles as its Liveblocks room id — clean it up too.
  await liveblocks.deleteRoom(id)
  Sentry.logger.info("Workflow deleted", { action: "deleteWorkflowAction" })
  revalidatePath("/workflows", "layout")
  redirect("/")
}

export async function runWorkflowAction({
  id,
  graph,
}: {
  id: string
  graph: WorkflowGraph
}) {
  const { has, orgId } = await auth()
  const scope = Sentry.getIsolationScope()
  scope.setAttributes({ action: "runWorkflowAction", workflowId: id })

  if (!orgId) {
    throw new Error("No active organization")
  }

  scope.setAttributes({ orgId })
  const containsAgentNode = graph.nodes.some(
    (node) => node.data.type === "agent"
  )

  if (containsAgentNode && !has({ plan: "org:pro" })) {
    Sentry.logger.warn("Workflow run denied because Agent requires Pro", {
      action: "runWorkflowAction",
    })
    throw new Error("Pro plan required to run workflows with an Agent node")
  }

  try {
    await saveWorkflowGraph({ orgId, id, graph })
  } catch (error) {
    Sentry.logger.error("Workflow graph validation or save failed", {
      action: "runWorkflowAction",
    })
    throw error
  }

  const handle = await tasks.trigger<typeof runWorkflowTask>(
    "run-workflow",
    { workflowId: id, orgId },
    { tags: [`workflow:${id}`] }
  )
  Sentry.logger.info("Workflow run triggered", {
    action: "runWorkflowAction",
    runId: handle.id,
  })
  return handle
}

export async function cancelWorkflowAction(runId: string) {
  const { orgId } = await auth()
  const scope = Sentry.getIsolationScope()
  scope.setAttributes({ action: "cancelWorkflowAction", runId })

  if (!orgId) {
    throw new Error("No active organization")
  }

  scope.setAttributes({ orgId })
  await runs.cancel(runId)
  Sentry.logger.info("Workflow run cancelled", {
    action: "cancelWorkflowAction",
  })
}
