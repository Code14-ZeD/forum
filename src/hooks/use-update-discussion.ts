import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type User } from "better-auth"
import { z } from "zod"

import { formSchema } from "@/hooks/use-create-discussion"

export function useUpdateDiscussion(user: User, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: z.infer<typeof formSchema> }) => {
      const response = await fetch(`/api/discussion`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, data }),
      })
      if (!response.ok) {
        throw new Error("Failed to update discussion")
      }
      return await response.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] })
      queryClient.invalidateQueries({ queryKey: [`discussion-${user.id}`] })
      queryClient.invalidateQueries({ queryKey: [`discussion-${id.id}`] })
      onSuccessCallback?.()
    },
  })
}
