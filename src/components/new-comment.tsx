"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type User } from "better-auth"
import { Loader2, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import Access from "@/components/access"

const formSchema = z.object({
  comment: z.string().min(2, {
    message: "Comment must be at least 1 characters.",
  }),
})

export default function Component({
  discussionId,
  user,
}: {
  discussionId: string
  user: User | null
}) {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  })
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/discussion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discussionId,
          ...values,
        }),
      })
      if (!response.ok) {
        throw new Error("Something went wrong!")
      }
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussions"],
      })
      queryClient.invalidateQueries({
        queryKey: [`discussion-${discussionId}`],
      })
      form.reset()
    },
    onError: (error) => {
      console.error("Error submitting data:", error)
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative mt-5 flex items-start gap-x-4"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">New Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Add Comment" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!user ? (
          <Access type="comment" />
        ) : (
          <Button
            className="mt-3.5 cursor-pointer"
            type="submit"
            size="icon"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        )}
      </form>
    </Form>
  )
}
