"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import ReactTimeago from "react-timeago";
import { Badge } from "./ui/badge";

const CommentFeed = ({ post }: { post: IPostDocument }) => {
  const { user } = useUser();

  const isAuthor = user?.id === post.user.userId;
  return (
    <div className='space-y-2 mt-3'>
      {post.comments?.map((comment) => (
        <div className='flex space-x-1' key={comment?._id}>
          <Avatar>
            <AvatarImage src={comment.user.userImage} />
            <AvatarFallback>
              {comment.user.firstName?.charAt(0)}
              {comment.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className='bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]'>
            <div className='flex justify-between'>
              <div>
                <p className='font-semibold flex items-center justify-between'>
                  {comment.user.firstName} {comment.user.lastName}
                  {isAuthor && (
                    <Badge className='ml-2 p-1 bg-gray-200' variant='outline'>
                      Author
                    </Badge>
                  )}
                </p>
                <p className='text-xs text-gray-400'>
                  @{comment.user.firstName}
                  {comment.user.firstName}-
                  {comment.user.userId.toString().slice(-4)}
                </p>
              </div>
              <p className='text-xs text-gray-400'>
                <ReactTimeago date={new Date(comment.createdAt)} />
              </p>
            </div>
            <p className='mt-3 text-sm'>{comment?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentFeed;
