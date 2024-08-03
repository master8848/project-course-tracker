"use server";

import { revalidatePath } from "next/cache";
import {
  createVideo,
  deleteVideo,
  updateVideo,
} from "@/lib/api/videos/mutations";
import {
  VideoId,
  NewVideoParams,
  UpdateVideoParams,
  videoIdSchema,
  insertVideoParams,
  updateVideoParams,
} from "@/lib/db/schema/videos";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateVideos = () => revalidatePath("/videos");

export const createVideoAction = async (input: NewVideoParams) => {
  try {
    const payload = insertVideoParams.parse(input);
    await createVideo(payload);
    revalidateVideos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateVideoAction = async (input: UpdateVideoParams) => {
  try {
    const payload = updateVideoParams.parse(input);
    await updateVideo(payload.id, payload);
    revalidateVideos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteVideoAction = async (input: VideoId) => {
  try {
    const payload = videoIdSchema.parse({ id: input });
    await deleteVideo(payload.id);
    revalidateVideos();
  } catch (e) {
    return handleErrors(e);
  }
};