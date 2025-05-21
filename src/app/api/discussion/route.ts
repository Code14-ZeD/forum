import { db } from "@/db"
import { and, asc, desc, eq, sql } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { user } from "@/db/schema/auth"
import { comment, discussion } from "@/db/schema/discussion"

export async function GET(request: Request) {
  try {
    const { id, userId } = Object.fromEntries(new URL(request.url).searchParams)

    if (id) {
      const discussionData = await db
        .select({
          id: discussion.id,
          userId: discussion.userId,
          title: discussion.title,
          description: discussion.description,
          createdAt: discussion.createdAt,
          updatedAt: discussion.updatedAt,
          username: user.name,
          image: user.image,
        })
        .from(discussion)
        .where(eq(discussion.id, id))
        .innerJoin(user, eq(discussion.userId, user.id))
        .limit(1)

      const commentsData = await db
        .select({
          id: comment.id,
          userId: comment.userId,
          discussionId: comment.discussionId,
          comment: comment.comment,
          createdAt: comment.createdAt,
          username: user.name,
          image: user.image,
        })
        .from(comment)
        .where(eq(comment.discussionId, id))
        .orderBy(asc(comment.createdAt))
        .innerJoin(user, eq(comment.userId, user.id))

      return Response.json(
        {
          data: {
            ...(discussionData[0] || {}),
            comments: commentsData,
          },
        },
        { status: 200 },
      )
    }

    if (userId) {
      return Response.json({
        data: await db
          .select({
            id: discussion.id,
            userId: discussion.userId,
            title: discussion.title,
            description: discussion.description,
            createdAt: discussion.createdAt,
            updatedAt: discussion.updatedAt,
            username: user.name,
            image: user.image,
            comments: sql<number>`COUNT(${comment.id})`.as("comments"),
          })
          .from(discussion)
          .leftJoin(comment, eq(comment.discussionId, discussion.id))
          .innerJoin(user, eq(discussion.userId, user.id))
          .where(eq(discussion.userId, userId))
          .groupBy(discussion.id, user.name, user.image)
          .orderBy(desc(discussion.updatedAt)),
        // .offset(page ? parseInt(page) : 0)
        // .limit(perPage ? parseInt(perPage) : 10),
      })
    }

    return Response.json({
      data: await db
        .select({
          id: discussion.id,
          userId: discussion.userId,
          title: discussion.title,
          description: discussion.description,
          createdAt: discussion.createdAt,
          updatedAt: discussion.updatedAt,
          username: user.name,
          image: user.image,
          comments: sql<number>`COUNT(${comment.id})`.as("comments"),
        })
        .from(discussion)
        .leftJoin(comment, eq(comment.discussionId, discussion.id))
        .innerJoin(user, eq(discussion.userId, user.id))
        .groupBy(discussion.id, user.name, user.image)
        .orderBy(desc(discussion.updatedAt)),
      // .offset(page ? parseInt(page) : 0)
      // .limit(perPage ? parseInt(perPage) : 10),
    })
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 404 })
    } else {
      return Response.json({ message: "404" }, { status: 404 })
    }
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, discussionId, comment: _comment } = await request.json()

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (discussionId && comment) {
      await db.insert(comment).values({
        userId: session.user.id,
        discussionId,
        comment: _comment,
        createdAt: new Date(),
      })

      await db
        .update(discussion)
        .set({ updatedAt: new Date() })
        .where(eq(discussion.id, discussionId))

      return Response.json({ message: "OK" }, { status: 200 })
    }

    await db.insert(discussion).values({
      userId: session.user.id,
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json({ message: "OK" }, { status: 200 })
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 404 })
    } else {
      return Response.json({ message: "404" }, { status: 404 })
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return Response.json({ message: "Missing id" }, { status: 400 })
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    await db
      .delete(discussion)
      .where(and(eq(discussion.id, id), eq(discussion.userId, session.user.id)))

    return Response.json({ message: "OK" }, { status: 200 })
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 404 })
    } else {
      return Response.json({ message: "404" }, { status: 404 })
    }
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, data } = await request.json()

    if (!id || (!data.title && !data.description)) {
      return Response.json({ message: "Missing fields" }, { status: 400 })
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Prepare the fields to update
    const updateData: Partial<typeof discussion.$inferInsert> = {
      updatedAt: new Date(),
    }

    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description

    const result = await db
      .update(discussion)
      .set(updateData)
      .where(and(eq(discussion.id, id), eq(discussion.userId, session.user.id)))

    return Response.json({ message: "OK", result }, { status: 200 })
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 404 })
    } else {
      return Response.json({ message: "404" }, { status: 404 })
    }
  }
}
