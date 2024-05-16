"use client";
import React, { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import createPostAction from "@/actions/createPostAction";
import { toast } from "sonner";

const PostForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const [preview, setPreview] = useState<string | null>(null);

  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    ref.current?.reset();

    const text = formDataCopy.get("postInput") as string;

    if (!text.trim()) {
      throw new Error("You must provide a post input");
    }

    setPreview(null);

    try {
      await createPostAction(formDataCopy);
    } catch (error) {
      console.log("Error creating post: ", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className='mb-2'>
      <form
        ref={ref}
        action={(FormData) => {
          //Handle form submission with server action
          const promise = handlePostAction(FormData);

          //Toast notification based on the promise above
          toast.promise(promise, {
            loading: "Creating post...",
            success: "Post created",
            error: "Failed to create post",
          });
        }}
        className='p-3 bg-white rounded-lg border'
      >
        <div className='flex items-center space-x-2'>
          <Avatar>
            {user?.id ? (
              <AvatarImage src={user?.imageUrl} />
            ) : (
              <>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          <input
            type='text'
            name='postInput'
            placeholder='Start writing a post...'
            className='flex-1 outline-none rounded-full py-3 px-4 border'
          />

          <input
            ref={fileInputRef}
            type='file'
            name='image'
            accept='image/*'
            hidden
            onChange={handleImageChange}
          />

          <button type='submit' hidden>
            Post
          </button>
        </div>

        {/* Preview conditional check */}
        {preview && (
          <div className='mt-3'>
            <Image
              src={preview}
              alt='Preview'
              className='w-full object-cover'
              width={500}
              height={500}
            />
          </div>
        )}
        <div className='flex justify-end mt-2 space-x-2'>
          <Button
            type='button'
            variant={preview ? "secondary" : "outline"}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className='mr-2' size={16} color='currentColor' />
            {preview ? "Change" : "Add"} image
          </Button>

          {/* Add a remove preview button */}
          {preview && (
            <Button
              variant={"outline"}
              type='button'
              onClick={() => setPreview(null)}
            >
              <XIcon className='mr-2' size={16} color='currentColor' />
              Remove Image
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;
