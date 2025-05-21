import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type User } from "better-auth"
import { z } from "zod"

export const formSchema = z.object({
  title: z.string().min(12, {
    message: "Title must be at least 12 characters.",
  }),
  description: z.string().min(24, {
    message: "Description must be at least 24 characters.",
  }),
})

export function useCreateDiscussion(user: User, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/discussion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        throw new Error("Something went wrong!")
      }
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] })
      queryClient.invalidateQueries({ queryKey: [`discussion-${user.id}`] })
      onSuccessCallback?.()
    },
  })
}
