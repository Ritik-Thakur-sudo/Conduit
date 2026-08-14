import { PricingTable } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function PricingPage() {
  const { orgId } = await auth()

  if (!orgId) {
    redirect("/choose-organization")
  }

  return (
    <main className="min-h-svh overflow-y-auto px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Organization plans
          </h1>
          <p className="text-muted-foreground">
            Choose the plan that fits your organization. You can manage the
            subscription here at any time.
          </p>
        </div>
        <PricingTable
          for="organization"
          highlightedPlan="pro"
          newSubscriptionRedirectUrl="/pricing"
        />
      </div>
    </main>
  )
}
