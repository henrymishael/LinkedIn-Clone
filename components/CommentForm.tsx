"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React, { useRef } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import createCommentAction from "@/actions/createCommentAction";
import { toast } from "sonner";

const CommentForm = ({ postId }: { postId: String }) => {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    if (!user?.id) {
      throw new Error();
    }
    const formDataCopy = formData;
    ref.current?.reset();

    try {
      //server action
      await createCommentActionWithPostId(formDataCopy);
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
    }
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);

        toast.promise(promise, {
          loading: "Creating comment...",
          success: "Comment created",
          error: "Failed to create comment",
        });
      }}
      className='flex items-center space-x-2'
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div>
        <input
          type='text'
          name='commentInput'
          placeholder='Add a comment...'
          className='outline-none flex-1 text-sm bg-transparent'
        />
        <button type='submit' hidden>
          Comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
