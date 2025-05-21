"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { type User } from "better-auth"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { formSchema } from "@/hooks/use-create-discussion"
import { useUpdateDiscussion } from "@/hooks/use-update-discussion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface EditDiscussionDialogProps {
  user: User
  discussion: {
    id: string
    title: string
    description: string
  }
}

export default function Page({ user, discussion }: EditDiscussionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: discussion.title,
      description: discussion.description,
    },
    mode: "onChange",
  })

  const mutation = useUpdateDiscussion(user, () => {
    form.reset()
    setIsOpen(false)
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(
      { id: discussion.id, data: values },
      {
        onError: (error) => {
          console.error(error)
          form.setError("root", {
            type: "manual",
            message: "Update failed. Try again.",
          })
        },
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="cursor-pointer">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center">Edit Discussion</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Title</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Title" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.isPending || !form.formState.isValid}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
