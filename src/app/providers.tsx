// app/providers.tsx
'use client'

import { toast } from "sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ApiError } from "../utils"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
})

function ErrorHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('ErrorHandler mounted')
    
    const unsubscribe = queryClient.getMutationCache().subscribe((event) => {
      console.log('Mutation event:', event.type, event?.mutation?.state.status)
      
      if (event.type === 'updated' && event.mutation.state.status === 'error') {
        const error = event.mutation.state.error
        console.log('Error caught:', error)

        if (error instanceof ApiError) {
          console.log('Is ApiError, validationErrors:', error.validationErrors)
          
          if (error.validationErrors) {
            // Show validation errors
            Object.entries(error.validationErrors).forEach(([field, errors]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1)
              const messages = Array.isArray(errors) ? errors : [errors]
              messages.forEach(msg => {
                console.log('Showing toast:', `${fieldName}: ${msg}`)
                toast.error(`${fieldName}: ${msg}`)
              })
            })
          } else {
            console.log('Showing toast:', error.message)
            toast.error(error.message)
          }
        } else if (error instanceof Error) {
          console.log('Is Error, showing toast:', error.message)
          toast.error(error.message)
        } else {
          console.log('Unknown error type:', error)
          toast.error('An error occurred')
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorHandler>{children}</ErrorHandler>
    </QueryClientProvider>
  )
}