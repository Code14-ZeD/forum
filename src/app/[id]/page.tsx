import type { Metadata } from "next"

import Client from "./client"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/discussion?id=${id}`)

  if (!response.ok) {
    return {
      title: "Forum",
      description: "An online discussion platform",
    }
  }

  const data = (await response.json()).data

  return {
    title: data?.title || "Forum",
    description: data?.description || "An online discussion platform",
    openGraph: {
      title: data?.title || "Forum",
      description: data?.description || "An online discussion platform",
      url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/${id}`,
      images: [
        {
          url: data?.image,
        },
      ],
    },
  }
}

export default async function Page() {
  return <Client />
}
