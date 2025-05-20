"use client"

import { useSession } from "@/lib/auth/client"
import UserDiscussions from "@/components/user-discussions"

export default function Page() {
  const { data: session } = useSession()

  return (
    <>
      <h1 className="text-center">User</h1>
      <UserDiscussions user={session?.user || null} />
    </>
  )
}
