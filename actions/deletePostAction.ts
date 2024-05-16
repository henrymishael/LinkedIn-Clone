"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Post } from "@/mongodb/models/post";
import { revalidate } from "@/app/page";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.user.userId !== user.id) {
    throw new Error("User not authorized to delete post");
  }

  try {
    await post.removePost();
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while deleting the post");
  }
}
