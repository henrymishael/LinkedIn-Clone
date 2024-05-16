import { IPostDocument } from "@/mongodb/models/post";
import Post from "./Post";

function PostFeed({ posts }: { posts: IPostDocument[] }) {
  return (
    <div className='space-y-2 pb-20'>
      {posts ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PostFeed;
