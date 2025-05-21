"use client"

import { useState } from "react"

import { useDeleteDiscussion } from "@/hooks/use-delete-discussion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Page({ id, pathname }: { id: string; pathname: string | null }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate, isPending } = useDeleteDiscussion(pathname, setIsDialogOpen)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <span className="text-destructive cursor-pointer">Delete</span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center">Delete confirmation</DialogTitle>
        <div className="flex items-center justify-between">
          <p>Are you sure?</p>
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={isPending}
            onClick={() => {
              mutate(id)
            }}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
