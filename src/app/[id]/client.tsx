"use client"

import { useSession } from "@/lib/auth/client"
import Discussion from "@/components/discussion"

export default function Page() {
  const { data: session } = useSession()

  return (
    <>
      <h1 className="text-center">Discussion</h1>
      <Discussion user={session?.user || null} />
    </>
  )
}
