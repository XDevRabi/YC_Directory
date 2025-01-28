import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home(
  // since everysingle next js page can get the url search params by  using searchParams parameter.
  {
    searchParams,
  }: {
    searchParams: Promise<{ query?: string }>; // searchParams is a promise and return the query string
  }
) {
  const query = (await searchParams).query; // get the query from searchParams
  const params = { search: query || null }; // params variable is used to pass the query to the sanity query for real time search.

  const session = await auth();

  // console.log(session?.id);

  // const posts = await client.fetch(STARTUPS_QUERY); // fetch data from sanity. to use this we have to `import { client } from "@/sanity/lib/client` But to fetch live data automatically we have to use "sanityFetch"
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  // Post Data sample
  // const posts = [
  //   {
  //      _createdAt: new Date("2023-08-06T06:15:32.000Z"),
  //     views: 55,
  //     auther: {_id: 1, name: "John Doe"},
  //     _id: 1,
  //     description: "THis is a description",
  //     image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  //     category: "Robots",
  //     title: "Robotics",
  //   }
  // ]

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map(
              (
                post: StartupTypeCard // StartupTypeCard is the type of post
              ) => <StartupCard key={post?._id} post={post} />
            )
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      {/* when we fetch data from sanityFetch we have to render  "SanityLive" compo */}
      <SanityLive />
    </>
  );
}
