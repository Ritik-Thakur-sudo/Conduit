import { Liveblocks } from "@liveblocks/node"

export function getLiveblocks() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not set")
  }

  return new Liveblocks({
    secret,
  })
}
