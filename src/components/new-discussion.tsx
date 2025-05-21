"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { type User } from "better-auth"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { formSchema, useCreateDiscussion } from "@/hooks/use-create-discussion"
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

export default function Page({ user }: { user: User }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  })

  const mutation = useCreateDiscussion(user, () => {
    form.reset()
    setIsDialogOpen(false)
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values, {
      onError: (error) => {
        console.error("Error submitting data:", error)
        form.setError("root", {
          type: "manual",
          message: "Failed to create discussion. Please try again.",
        })
      },
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size="icon" variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center">New Discussion</DialogTitle>
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
              className="w-full cursor-pointer"
              type="submit"
              disabled={mutation.isPending || !form.formState.isValid}
            >
              {mutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
