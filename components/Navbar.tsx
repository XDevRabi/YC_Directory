import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
// import { BadgePlus, LogOut } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = async () => {
  // Since its a server rendered component we can use async
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {/* Show only when user is logged in. which can be found using session */}
          {session && session?.user ? (
            <>
              {/* to navigate the user to the create startup page */}
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
                {/* <BadgePlus className="size-6 sm:hidden" /> */}
              </Link>

              {/* to use signOut function we have to use await (since signOut function is a async function). and to use await we have to make the function async. Now the async await run on server side so we cannot to button onclick method (since it is client side) so we have to use form tag. in react 19 we can pass a server action to a form to auto submit the form to the server. */}
              <form
                // this function tells the function is a server action
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">
                  <span className="max-sm:hidden">Logout</span>
                  {/* <LogOut className="size-6 sm:hidden text-red-500" /> */}
                </button>
              </form>

              {/* to point to the user profile page */}
              <Link href={`/user/${session?.id}`}>
                {/* <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar> */}
              </Link>
            </>
          ) : (
            // Shows when user is not logged in i.e session is not exists
            <form
              action={async () => {
                "use server";

                await signIn("github"); // Sign in with GitHub
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
