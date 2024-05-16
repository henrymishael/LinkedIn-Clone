import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface UnlikePostRequestBody {
  userId: string;
}

// export async function GET(
//   request: Request,
//   { params }: { params: { post_id: string } }
// ) {
//   await connectDB();

//   try {
//     const post = await Post.findById(params.post_id);

//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const likes = post.likes;
//     return NextResponse.json(likes);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "An error ocurred while fetching likes" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  auth().protect();

  await connectDB();

  const { userId }: UnlikePostRequestBody = await request.json();
  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await post.unlikePost(userId);
    return NextResponse.json({ message: "You unliked this post" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error ocurred while deleting the post" },
      { status: 500 }
    );
  }
}
