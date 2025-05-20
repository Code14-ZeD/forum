"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import { RiGithubFill, RiGoogleFill } from "@remixicon/react"
import { Loader2, Plus, Send } from "lucide-react"
import { toast } from "sonner"

import { signIn } from "@/lib/auth/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Component({ type }: { type?: "comment" | "discussion" }) {
  const pathname = usePathname()

  const [loader, setLoader] = useState<"email" | "github" | "google" | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn("cursor-pointer", type === "comment" && "mt-3.5")}
          size="icon"
          variant="outline"
        >
          {type === "comment" ? <Send /> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <div className="flex flex-col gap-6">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input disabled id="email" type="email" placeholder="m@example.com" required />
                </div>
                <Button
                  disabled
                  type="submit"
                  className="w-full cursor-pointer"
                  onClick={async () => {
                    setLoader("email")
                    toast.info("Not implemented yet! Try Github!")
                    setLoader(null)
                  }}
                  // disabled={loader === "email"}
                >
                  {loader === "email" ? <Loader2 className="size-5 animate-spin" /> : null}
                  Login
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">Or</span>
              </div>
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={async () => {
                    setLoader("github")
                    const res = await signIn.social({
                      provider: "github",
                      callbackURL: pathname,
                    })
                    if (res.error) {
                      toast.error(res.error.message)
                      setLoader(null)
                    }
                  }}
                  disabled={loader === "github"}
                >
                  {loader === "github" ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <RiGithubFill className="size-5" />
                  )}
                  Continue with Github
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={async () => {
                    setLoader("google")
                    const res = await signIn.social({
                      provider: "google",
                      callbackURL: pathname,
                    })
                    if (res.error) {
                      toast.info("Not implemented yet! Try Github!")
                      setLoader(null)
                    }
                  }}
                  disabled={loader === "google"}
                >
                  {loader === "google" ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <RiGoogleFill className="size-5" />
                  )}
                  Continue with Google
                </Button>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
