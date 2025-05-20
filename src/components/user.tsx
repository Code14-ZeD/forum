"use client"

import { useRouter } from "next/navigation"

import { LogOut } from "lucide-react"

import { signOut } from "@/lib/auth/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function Component({
  session,
}: {
  session: {
    user: {
      name: string
      email: string
      image?: string | null
    }
  }
}) {
  const router = useRouter()

  return (
    <Menubar asChild>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Avatar className="size-9 cursor-pointer rounded-full p-0">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback>VJ</AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent className="mt-3 -mr-2" side="bottom" align="end">
          <MenubarLabel className="text-end">
            <span className="font-medium">{session.user.name}</span>
            <br />
            <span className="text-xs">{session.user.email}</span>
          </MenubarLabel>
          <MenubarSeparator />
          <MenubarItem
            className="text-destructive flex cursor-pointer justify-between"
            onClick={async () => {
              await signOut()
              router.refresh()
            }}
          >
            <LogOut className="text-destructive" />
            Log Out
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
