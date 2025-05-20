"use client"

import { useSession } from "@/lib/auth/client"
import HomeDiscussions from "@/components/home-discussions"

export default function Page() {
  const { data: session } = useSession()

  return (
    <>
      <h1 className="text-center">All Discussions</h1>
      <HomeDiscussions user={session?.user || null} />
    </>
  )
}
