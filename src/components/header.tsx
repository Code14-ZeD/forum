"use client"

import Link from "next/link"

import { Signature } from "lucide-react"

import { useSession } from "@/lib/auth/client"
import Access from "@/components/access"
import ModeToggle from "@/components/mode-toggle"
import NewDisccusion from "@/components/new-discussion"
import User from "@/components/user"

export default function Component() {
  const { data: session } = useSession()

  return (
    <header className="bg-sidebar flex items-center justify-between rounded-md border px-3 py-3">
      <Link href="/" className="flex items-center gap-x-1 font-mono font-semibold">
        <Signature className="size-5" /> Forum
      </Link>
      <div className="flex items-center gap-x-4">
        <ModeToggle />
        {!session?.user ? (
          <Access />
        ) : (
          <>
            <NewDisccusion user={session.user} />
            <User session={session} />
          </>
        )}
      </div>
    </header>
  )
}
