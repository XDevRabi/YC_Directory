import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

export const experimental_ppr = true; // to enable ppr.

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id; // get the id from params. /startup/[id]

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });


  if (!post) return notFound();

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>


    </>
  );
};

export default Page;
