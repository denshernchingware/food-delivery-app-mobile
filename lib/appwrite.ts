import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform:"com.dmtech.food-delivery",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASEID!,
    userCollectionId:'user'
}

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint) // Your API Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform);

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

        if (!newAccount) throw new Error('Failed to create account');

        const avatarUrl = avatars.getInitialsURL(name);

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,
                name,
                accountId: newAccount.$id,
                avatar: avatarUrl,
            }
        );

        await signIn({ email, password });

        return newAccount;
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to create account');
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const existingSession = await account.getSession('current').catch(() => null);

        if (existingSession) {
            return existingSession;
        }

        return await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Failed to sign in');
    }
}



export const getCurrentSession = async () => {
    try {
        return await account.getSession('current');
    } catch {
        return null;
    }
}

export const getCurrentUser = async () => {
    try {
        const [currentSession, currentAccount] = await Promise.all([
            getCurrentSession(),
            account.get().catch(() => null),
        ]);

        if (!currentSession || !currentAccount) {
            return null;
        }

        let currentUser;

        try {
            currentUser = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            if (message.includes('Attribute not found in schema')) {
                console.log('accountId attribute missing, trying email fallback');
                currentUser = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.userCollectionId,
                    [Query.equal('email', currentAccount.email)]
                );
            } else {
                throw error;
            }
        }

        if (currentUser.documents[0]) {
            return currentUser.documents[0];
        }

        return {
            $id: currentAccount.$id,
            name: currentAccount.name || currentAccount.email || 'User',
            email: currentAccount.email,
            avatar: '',
        };
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.log('getCurrentUser error', message);

        if (message.includes('Attribute not found in schema')) {
            console.log('Your Appwrite collection is missing the accountId attribute required by the docs flow.');
        }

        return null;
    }
}