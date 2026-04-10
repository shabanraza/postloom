import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'
import type { PropsWithChildren } from 'react'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof Error && error.name === 'AbortError') {
            return false
          }
          return failureCount < 3
        },
      },
    },
  })

  return {
    queryClient,
  }
}

export function Provider({ children }: PropsWithChildren) {
  return <>{children}</>
}
