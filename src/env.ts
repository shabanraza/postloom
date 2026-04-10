import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

// TanStack Start + @t3-oss/env-core pattern:
// - Use import.meta.env as the single runtimeEnv source
// - Define which keys are server-only vs client-exposed
export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
  },

  // Client-side vars must be prefixed with VITE_
  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_GA4_MEASUREMENT_ID: z.string().optional(),
    VITE_CF_BEACON_TOKEN: z.string().optional(),
  },

  // TanStack Start recommended: runtimeEnv is import.meta.env
  runtimeEnv: import.meta.env,

  emptyStringAsUndefined: true,
})
