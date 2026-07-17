import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform:"com.dmtech.food-delivery",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASEID!,
    userCollectionId:'user'
}

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)// Your API Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);


// export const result = await account.create({
//     userId: '<USER_ID>',
//     email: 'email@example.com',
//     password: '',
//     name: '<NAME>' // optional
// });

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );
        if (!newAccount) throw Error;

        await SignIn({email,password})

        
        const avatarUrl = avatars.getInitialsURL(name);


        return await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                ID.unique(),
                {                   
                    email,
                    name,
                    accountID: newAccount.$id,
                    avatar: avatarUrl ,
                    
                }
);


    } catch (e) {
        throw new Error(e as string);
        
    }
}

export const SignIn = async ({ email, password }: SignInParams) => {
     try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}