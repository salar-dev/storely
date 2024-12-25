"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

const getUserByEmail = async (email: string) => {
    const {databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) =>{
    console.log(error, message);
    throw error;
}

export const sendEmailOTP = async ({email}: {email : string}) => {
    const {account} = await createAdminClient();

    try{
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;
    }catch(error){
        handleError(error, "Faild to send email OTP");
    }
};

export const createAccount = async ({
    fullName,
    email,
  }: {
    fullName: string;
    email: string;
  }) => {
    const existingUser = await getUserByEmail(email);
  
    const accountID = await sendEmailOTP({ email });
    if (!accountID) throw new Error("Failed to send an OTP");
  
    if (!existingUser) {
      const { databases } = await createAdminClient();
  
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          accountID,
        },
      );
    }
  
    return parseStringify({ accountID });
  };

  export const verifyEmailOTP = async ({accountId, password} : {accountId: string, password: string}) => {
    
  
    try{
        const {account} = await createAdminClient();
      const session = await account.createSession(accountId, password);
      ((await cookies()).set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      }));
      return parseStringify({ sessionId: session.$id });
    }catch(error){
      handleError(error, "Faild to verify email OTP");
    }
  };


