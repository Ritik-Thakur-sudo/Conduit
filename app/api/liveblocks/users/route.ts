import { auth, clerkClient } from "@clerk/nextjs/server"
import * as Sentry from "@sentry/nextjs"

// `Liveblocks` is a global interface declared in liveblocks.config.ts.
type UserInfo = Liveblocks["UserMeta"]["info"]

export async function POST(request: Request) {
  const { userId, orgId } = await auth()
  Sentry.getIsolationScope().setAttributes({
    route: "/api/liveblocks/users",
    userId: userId ?? "anonymous",
    orgId: orgId ?? "none",
  })

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  let userIds: unknown
  try {
    ;({ userIds } = await request.json())
  } catch {
    Sentry.logger.warn("Liveblocks users request contained malformed JSON", {
      route: "/api/liveblocks/users",
    })
    return new Response("Invalid JSON body", { status: 400 })
  }

  if (!Array.isArray(userIds) || userIds.some((id) => typeof id !== "string")) {
    Sentry.logger.warn("Liveblocks users request contained an invalid body", {
      route: "/api/liveblocks/users",
    })
    return new Response("Expected { userIds: string[] }", { status: 400 })
  }

  const ids = userIds as string[]

  if (ids.length === 0) {
    return Response.json([])
  }

  // Only resolve users that belong to the caller's organization, so display
  // info can't be harvested for arbitrary users across other tenants.
  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({
    userId: ids,
    organizationId: [orgId],
    limit: ids.length,
  })

  const usersById = new Map(users.map((user) => [user.id, user]))

  // Return one entry per requested ID, in the same order, null for unknown.
  const resolved: (UserInfo | null)[] = ids.map((id) => {
    const user = usersById.get(id)

    if (!user) {
      return null
    }

    return {
      name:
        user.fullName ??
        user.username ??
        user.primaryEmailAddress?.emailAddress ??
        "Anonymous",
      avatar: user.imageUrl,
    }
  })
  Sentry.logger.info("Liveblocks users resolved", {
    route: "/api/liveblocks/users",
    requestedUserCount: ids.length,
    resolvedUserCount: resolved.filter(Boolean).length,
  })
  return Response.json(resolved)
}
