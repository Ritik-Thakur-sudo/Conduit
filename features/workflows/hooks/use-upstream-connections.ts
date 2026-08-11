"use client"

import { useMemo } from "react"
import { getIncomers, useEdges, useNodes } from "@xyflow/react"
import {
  nodeRegistry,
  type NodeType,
  type StepNodeType,
} from "@/features/workflows/nodes/node-registry"

export type UpstreamConnection = {
  token: string
  label: string
  type: NodeType
}

export function useUpstreamConnections(
  selectedNode: StepNodeType | undefined
): UpstreamConnection[] {
  const nodes = useNodes<StepNodeType>()
  const edges = useEdges()

  return useMemo(() => {
    if (!selectedNode) {
      return []
    }

    const currentNode = nodes.find((node) => node.id === selectedNode.id)

    if (!currentNode) {
      return []
    }

    const upstreamIds = new Set<string>()
    const nodesToVisit = [currentNode]

    while (nodesToVisit.length > 0) {
      const node = nodesToVisit.pop()!

      for (const upstreamNode of getIncomers(node, nodes, edges)) {
        if (upstreamIds.has(upstreamNode.id)) {
          continue
        }

        upstreamIds.add(upstreamNode.id)
        nodesToVisit.push(upstreamNode)
      }
    }

    return nodes.flatMap((node) => {
      if (!upstreamIds.has(node.id)) {
        return []
      }

      return nodeRegistry[node.data.type].outputs.map((output) => ({
        token: `{{ ${node.id}.${output.path} }}`,
        label: `${node.data.title} · ${output.label}`,
        type: node.data.type,
      }))
    })
  }, [edges, nodes, selectedNode])
}
