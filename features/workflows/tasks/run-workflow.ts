import toposort from "toposort"
import { logger, task } from "@trigger.dev/sdk"
import { getWorkflow } from "@/features/workflows/data"
import { Stagehand } from "@browserbasehq/stagehand"
import { nodeExecutors } from "../nodes/node-executors"

export const runWorkflowTask = task({
  id: "run-workflow",
  run: async ({ workflowId, orgId }: { workflowId: string; orgId: string }) => {
    const worflow = await getWorkflow(orgId, workflowId)

    if (!worflow?.graph) {
      throw new Error(`Workflow ${worflow} has no graph`)
    }

    const { nodes, edges } = worflow.graph
    const byId = new Map(nodes.map((n) => [n.id, n]))

    // Only connected nodes - anhything touching an edge
    const connected = new Set(edges.flatMap((e) => [e.source, e.target]))

    const order = toposort
      .array(
        nodes.map((n) => n.id),
        edges.map((e) => [e.source, e.target])
      )
      .filter((id) => connected.has(id))
    logger.log(`Running workflow ${worflow.name}`, { steps: order.length })

    let stagehand: Stagehand | undefined

    const getStagehand = async () => {
      if (stagehand) {
        return stagehand
      }

      // The run owns one Browserbase session, opened lazily on the first browser step
      // and reused by every later one, so the recording spans the whole flow. The
      // LLM routes through Browserbase's Model Gateway (BROWSERBASE_API_KEY), so no
      // separate provider key is needed.
      stagehand = new Stagehand({
        env: "BROWSERBASE",
        apiKey: process.env.BROWSERBASE_API_KEY!,
        model: "google/gemini-2.5-flash",
        // Pino's logging backend spawns a thread-stream worker (lib/worker.js)
        // that can't be resolved inside trigger.dev's bundled output. Disable it —
        // the option exists for exactly these minimal/bundled environments.
        disablePino: true,
      })
      await stagehand.init()
      return stagehand
    }

    for (const id of order) {
      const node = byId.get(id)!
      logger.log(`Running step: ${node.data.title}`)
      const executor = nodeExecutors[node.data.type]

      if (executor) {
        await executor({ values: node.data.values, getStagehand })
      }
    }
    await stagehand?.close()
    return { steps: order.length }
  },
})
