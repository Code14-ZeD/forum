"use client"

import Link from "next/link"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { type User } from "better-auth"
import { differenceInMinutes, formatDistance } from "date-fns"
import { Loader2, MessageSquare } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Page({ user }: { user: User | null }) {
  const queryClient = useQueryClient()

  const { data, isError, isLoading } = useQuery({
    queryKey: ["discussions"],
    queryFn: async () => {
      const response = await fetch("/api/discussion")
      if (!response.ok) throw new Error("Something went wrong!")
      return (await response.json()).data
    },
  })

  const mutation = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussions"],
      })
    },
  })

  if (isLoading || isError) {
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <p>An error occurred. Please try again later!</p>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 divide-y">
      {data && data.length ? (
        data.map(
          ({
            id,
            userId,
            title,
            description,
            // votes,
            comments,
            createdAt,
            updatedAt,
            username,
            image,
          }: {
            id: string
            userId: string
            title: string
            description: string
            votes: number
            comments: number
            createdAt: string
            updatedAt: string
            username: string
            image: string
          }) => (
            <div key={id} className="flex min-h-24">
              {/*
              <div className="hidden w-24 items-start justify-center py-3.5">
                <p className="mt-1.75 flex cursor-pointer items-center gap-x-1 rounded-md border px-3 py-1 text-sm">
                  <ThumbsUp className="mb-0.5 size-3.75" /> {votes || 0}
                </p>
              </div> 
              */}
              <div className="flex flex-1 flex-col justify-between gap-y-4 py-3">
                <Link href={`/${id}`}>
                  <h2 className="line-clamp-2 font-medium">{title}</h2>
                  <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
                </Link>
                <p className="flex items-center text-xs">
                  <Avatar className="inline-block size-6">
                    <AvatarImage src={image} />
                    <AvatarFallback>VJ</AvatarFallback>
                  </Avatar>
                  &nbsp;∙&nbsp;
                  <Link href={`/user/${userId}`} className="border-muted-foreground border-b">
                    {username}
                  </Link>
                  &nbsp;∙&nbsp;
                  {formatDistance(new Date(createdAt), new Date(), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                  {Math.abs(differenceInMinutes(new Date(), new Date(updatedAt))) < 60 && " 🔥"}
                  {user?.id == userId && (
                    <>
                      &nbsp;∙&nbsp;
                      <span
                        className="text-destructive cursor-pointer"
                        onClick={() => {
                          mutation.mutate(id)
                        }}
                      >
                        Delete
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex w-18 items-center justify-center py-2">
                <p className="flex cursor-pointer items-center gap-x-1 rounded-md px-3 py-1 text-sm">
                  <MessageSquare className="size-4" /> {comments || 0}
                </p>
              </div>
            </div>
          ),
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center py-10">
          <p className="text-muted-foreground">No discussions yet!</p>
        </div>
      )}
    </div>
  )
}
