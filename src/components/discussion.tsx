"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useQuery } from "@tanstack/react-query"
import { type User } from "better-auth"
import { formatDistance } from "date-fns"
import { Loader2, MessageSquare } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Delete from "@/components/delete-confirmation"
import NewComment from "@/components/new-comment"
import UpdateDiscussion from "@/components/update-discussion"

export default function Page({ user }: { user: User | null }) {
  const pathname = usePathname()
  const { data, isError, isLoading } = useQuery({
    queryKey: [`discussion-${pathname.split("/")[1]}`],
    queryFn: async () => {
      const response = await fetch(`/api/discussion?id=${pathname.split("/")[1]}`)
      if (!response.ok) throw new Error("Something went wrong!")
      return (await response.json()).data ?? {}
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
    <div className="grid grid-cols-1">
      {data.id ? (
        <>
          <div key={data.id} className="flex">
            <div className="flex-1 space-y-2.5 py-2">
              <div>
                <h2 className="text-lg font-medium">{data.title}</h2>
                <p className="text-muted-foreground">{data.description}</p>
              </div>
              <p className="flex items-center text-xs">
                <Avatar className="inline-block size-6">
                  <AvatarImage src={data.image} />
                  <AvatarFallback>VJ</AvatarFallback>
                </Avatar>
                &nbsp;∙&nbsp;
                <Link href={`/user/${data.userId}`} className="border-muted-foreground border-b">
                  {data.username}
                </Link>
                &nbsp;∙&nbsp;
                {formatDistance(new Date(data.createdAt), new Date(), {
                  addSuffix: true,
                  includeSeconds: true,
                })}
                {user?.id == data.userId && (
                  <>
                    &nbsp;∙&nbsp;
                    <Delete id={data.id} pathname={null} />
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            {/* 
            <div className="flex items-start justify-center py-2">
              <p className="flex cursor-pointer items-center gap-x-1 rounded-md py-1 text-sm">
                <ThumbsUp className="mb-0.5 size-3.75" /> {data.votes || 0}
              </p>
            </div> 
            */}
            <div className="flex items-center justify-center py-2">
              <p className="mr-2 flex items-center gap-x-1 rounded-md py-1 text-sm">
                <MessageSquare className="size-4" /> {data.comments.length}
              </p>
              {user && user?.id == data.userId && (
                <UpdateDiscussion
                  user={user}
                  discussion={{ id: data.id, title: data.title, description: data.description }}
                />
              )}
            </div>
          </div>

          <NewComment user={user} discussionId={data.id} />

          <div className="mt-5 flex flex-col gap-y-3">
            {data.comments && data.comments.length ? (
              data.comments.map(
                (comment: {
                  id: string
                  userId: string
                  comment: string
                  description: string
                  createdAt: Date
                  username: string
                  image: string
                }) => (
                  <div key={comment.id} className="flex border-l-4 pb-1.5 pl-3">
                    <div className="flex-1 space-y-2.5">
                      <h2>{comment.comment}</h2>
                      <p className="flex items-center text-xs">
                        <Avatar className="inline-block size-6">
                          <AvatarImage src={comment.image} />
                          <AvatarFallback>VJ</AvatarFallback>
                        </Avatar>
                        &nbsp;∙&nbsp;
                        <Link
                          href={`/user/${comment.userId}`}
                          className="border-muted-foreground border-b"
                        >
                          {comment.username}
                        </Link>
                        &nbsp;∙&nbsp;
                        {formatDistance(new Date(comment.createdAt), new Date(), {
                          addSuffix: true,
                          includeSeconds: true,
                        })}
                      </p>
                    </div>
                  </div>
                ),
              )
            ) : (
              <p className="text-center">No comments yet!</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center py-10">
          <p className="text-muted-foreground">No such discussion exists!</p>
        </div>
      )}
    </div>
  )
}
