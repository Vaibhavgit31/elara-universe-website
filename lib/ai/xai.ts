import 'server-only'

import { createXai } from '@ai-sdk/xai'

// xAI Grok through the Vercel AI SDK provider (@ai-sdk/xai, Responses API):
// https://ai-sdk.dev/providers/ai-sdk-providers/xai — notes in docs/research/xai.md.
// Both the key and the model must be set; there is no guessed default model (see .env.example,
// where grok-4.3 is suggested). Without them the chatbot and the Test Maker run in mock mode.
const apiKey = process.env.XAI_API_KEY
const modelId = process.env.XAI_MODEL

export const aiConfigured = Boolean(apiKey && modelId)

/** The configured Grok model; only call this when `aiConfigured` is true. */
export const grok = () => createXai({ apiKey })(modelId!)
