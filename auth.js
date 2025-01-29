import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  // This function will executed after user authenticated by next-auth
  callbacks: {
    // Function to check if the user is already exist in our database or not
    async signIn({
      user: { name, email, image }, // destructuring the user object
      profile: { id, login, bio }, // destructuring the profile object
    }) {
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id,
        });

        // If the user is not exist in our database then create a new user/author on our `auther document` using writeClient.
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }

      return true;
    },

    // after successful signin we need to create author id from sanity to new at profile (author profile). to create a new startup content. for that let's modify the default jwt token and add the author id to it/
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });

        token.id = user?._id;
      }

      return token;
    },

    // To use the above token id we need to create a session function
    async session({ session, token }) {
      Object.assign(session, { id: token.id }); // pass the profile id from token to session
      return session;
    },
  },
});
