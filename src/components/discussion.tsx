"use client"

import React, { useState } from "react"
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

interface Comment {
  id: string
  commentId: string | null
  discussionId: string
  userId: string
  comment: string
  createdAt: string
  username: string
  image: string
}

function buildCommentTree(comments: Comment[]): Array<Comment & { replies: Comment[] }> {
  const byId: Record<string, Comment & { replies: Comment[] }> = {}
  comments.forEach((c) => {
    byId[c.id] = { ...c, replies: [] }
  })

  const roots: Array<Comment & { replies: Comment[] }> = []
  comments.forEach((c) => {
    if (c.commentId && byId[c.commentId]) {
      byId[c.commentId].replies.push(byId[c.id])
    } else {
      roots.push(byId[c.id])
    }
  })

  return roots
}

// Recursive Comment component
function Comment({
  comment,
  user,
  discussionId,
}: {
  comment: Comment & { replies: Comment[] }
  user: User | null
  discussionId: string
}) {
  const [showReply, setShowReply] = useState(false)

  return (
    <div className="flex border-l-4 pb-1.5 pl-3">
      <div className="flex-1 space-y-2.5">
        <h2>{comment.comment}</h2>
        <div className="flex items-center text-xs">
          <Avatar className="inline-block size-6">
            <AvatarImage src={comment.image} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          &nbsp;∙&nbsp;
          <Link href={`/user/${comment.userId}`} className="border-muted-foreground border-b">
            {comment.username}
          </Link>
          &nbsp;∙&nbsp;
          {formatDistance(new Date(comment.createdAt), new Date(), {
            addSuffix: true,
            includeSeconds: true,
          })}
          {user && (
            <>
              &nbsp;∙&nbsp;
              <button
                className="cursor-pointer rounded-md border px-2 py-px text-xs"
                onClick={() => setShowReply((prev) => !prev)}
              >
                Reply
              </button>
            </>
          )}
        </div>

        {/* Reply form */}
        {showReply && (
          <NewComment
            setReply={setShowReply}
            user={user}
            commentId={comment.id}
            discussionId={discussionId}
          />
        )}

        {/* Nested replies */}
        {(comment.replies as (Comment & { replies: Comment[] })[]).map((child) => (
          <Comment key={child.id} comment={child} user={user} discussionId={discussionId} />
        ))}
      </div>
    </div>
  )
}

export default function Page({ user }: { user: User | null }) {
  const pathname = usePathname()
  const discussionId = pathname.split("/")[1]

  const { data, isError, isLoading } = useQuery({
    queryKey: [`discussion-${discussionId}`],
    queryFn: async () => {
      const res = await fetch(`/api/discussion?id=${discussionId}`)
      if (!res.ok) throw new Error("Something went wrong!")
      return (await res.json()).data
    },
  })

  if (isLoading || isError) {
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        {isLoading ? <Loader2 className="animate-spin" /> : <p>An error occurred.</p>}
      </div>
    )
  }

  // Build the nested comment tree
  const commentTree = buildCommentTree(data.comments)

  return (
    <div className="grid grid-cols-1">
      {data.id ? (
        <>
          {/* Discussion header */}
          <div className="flex">
            <div className="flex-1 space-y-2.5 py-2">
              <div>
                <h2 className="text-lg font-medium">{data.title}</h2>
                <p className="text-muted-foreground">{data.description}</p>
              </div>
              <p className="flex items-center text-xs">
                <Avatar className="inline-block size-6">
                  <AvatarImage src={data.image} />
                  <AvatarFallback>?</AvatarFallback>
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
                {user?.id === data.userId && (
                  <>
                    &nbsp;∙&nbsp;
                    <Delete id={data.id} pathname={null} />
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Meta & New comment */}
          <div className="flex items-center gap-x-4">
            <div className="flex items-center justify-center py-2">
              <p className="mr-2 flex items-center gap-x-1 rounded-md py-1 text-sm">
                <MessageSquare className="size-4" /> {commentTree.length}
              </p>
              {user && user.id === data.userId && (
                <UpdateDiscussion
                  user={user}
                  discussion={{ id: data.id, title: data.title, description: data.description }}
                />
              )}
            </div>
          </div>

          <NewComment user={user} discussionId={data.id} />

          {/* Comments */}
          <div className="mt-5 flex flex-col gap-y-3">
            {commentTree.length ? (
              commentTree.map((c) => (
                <Comment key={c.id} comment={c} user={user} discussionId={data.id} />
              ))
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
