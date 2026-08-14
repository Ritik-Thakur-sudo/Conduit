"use client"

import { useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export const organizationPricingPath = "/pricing"

export function useOrganizationPro() {
  const { has, isLoaded, orgId } = useAuth()
  const router = useRouter()

  const isPro = Boolean(orgId && has?.({ plan: "org:pro" }))
  const upgrade = useCallback(() => {
    router.push(organizationPricingPath)
  }, [router])

  return {
    isLoaded,
    isPro,
    upgrade,
  }
}
