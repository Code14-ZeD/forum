import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteDiscussion(
  pathname: string | null,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/discussion", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error("Something went wrong!")
      }
      return await response.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["discussions"],
      })
      queryClient.invalidateQueries({
        queryKey: [`discussion-${pathname ? pathname : id}`],
      })
      setIsDialogOpen(false)
    },
  })
}
