import Ping from "@/components/Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client"; // let us to modify the data directly within our application.
import { after } from "next/server"; // allows to schedule work to be executed after a response is finished. useful for tasks and other side effects that should not block the response.

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false }) // locally defining that we want to fetch the latest data using PPR. same thing can be done globally from \sanity\lib\client.ts
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // update/write the views of the startup data. Without this the views data will be static (which was added at the time of starup creation) and will not be updated.
  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};
export default View;
