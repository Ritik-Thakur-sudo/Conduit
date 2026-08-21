import { auth } from "@clerk/nextjs/server"
import { NotFoundError } from "@browserbasehq/sdk"
import * as Sentry from "@sentry/nextjs"
import {getBrowserbase } from "@/lib/browserbase"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId, orgId } = await auth()
  const { sessionId } = await params
  Sentry.getIsolationScope().setAttributes({
    route: "/api/replays/[sessionId]",
    userId: userId ?? "anonymous",
    orgId: orgId ?? "none",
    sessionId,
  })

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const replay = await getBrowserbase().sessions.replays.retrieve(sessionId)
    const firstPage = replay.pages[0]

    if (!firstPage) {
      return new Response(null, { status: 202 })
    }

    const playlist = await getBrowserbase().sessions.replays.retrievePage(
      sessionId,
      firstPage.pageId
    )
    const m3u8 = await playlist.text()

    Sentry.logger.info("Session replay served", {
      route: "/api/replays/[sessionId]",
      sessionId,
    })

    return new Response(m3u8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response(null, { status: 202 })
    }
    throw error
  }
}
