import { Suspense } from "react";

import Loading from "@/app/loading";
import VideoList from "@/components/videos/VideoList";
import { getVideos } from "@/lib/api/videos/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function VideosPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Videos</h1>
        </div>
        <Videos />
      </div>
    </main>
  );
}

const Videos = async () => {
  await checkAuth();

  const { videos } = await getVideos();
  
  return (
    <Suspense fallback={<Loading />}>
      <VideoList videos={videos}  />
    </Suspense>
  );
};
