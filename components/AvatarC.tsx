import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { currentUser } from "@clerk/nextjs/server";

const AvatarC = async () => {
  const user = await currentUser();

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;
  return (
    <div>
      <Avatar>
        {user?.id ? (
          <AvatarImage src={imageUrl} />
        ) : (
          <>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>
              {firstName?.charAt(0)}
              {lastName?.charAt(0)}
            </AvatarFallback>
          </>
        )}
      </Avatar>
    </div>
  );
};

export default AvatarC;
