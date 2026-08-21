import { auth, currentUser } from "@clerk/nextjs/server"
import * as Sentry from "@sentry/nextjs"
import { getLiveblocks } from "@/lib/liveblocks"

export async function POST() {
  const { userId, orgId } = await auth()
  Sentry.getIsolationScope().setAttributes({
    route: "/api/liveblocks/auth",
    userId: userId ?? "anonymous",
    orgId: orgId ?? "none",
  })

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const user = await currentUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Identify the user with an ID token. Permissions are resolved per-room
  // from the user's groups — scope access to their Clerk organization.
  try {
    const { status, body } = await getLiveblocks().identifyUser(
      {
        userId,
        groupIds: [orgId],
        organizationId: orgId,
      },
      {
        userInfo: {
          name:
            user.fullName ??
            user.username ??
            user.primaryEmailAddress?.emailAddress ??
            "Anonymous",
          avatar: user.imageUrl,
        },
      }
    )
    Sentry.logger.info("Liveblocks user identified", {
      route: "/api/liveblocks/auth",
      status,
    })
    return new Response(body, { status })
  } catch (error) {
    Sentry.logger.error("Liveblocks user identification failed", {
      route: "/api/liveblocks/auth",
    })
    throw error
  }
}
