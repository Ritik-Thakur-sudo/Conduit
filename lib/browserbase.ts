import Browserbase from "@browserbasehq/sdk"

export function getBrowserbase() {
  const apiKey = process.env.BROWSERBASE_API_KEY

  if (!apiKey) {
    throw new Error("BROWSERBASE_API_KEY is not set")
  }

  return new Browserbase({
    apiKey,
  })
}
