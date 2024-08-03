"use server";

import { revalidatePath } from "next/cache";
import {
  createAllVideo,
  deleteAllVideo,
  updateAllVideo,
} from "@/lib/api/allVideos/mutations";
import {
  AllVideoId,
  NewAllVideoParams,
  UpdateAllVideoParams,
  allVideoIdSchema,
  insertAllVideoParams,
  updateAllVideoParams,
} from "@/lib/db/schema/allVideos";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateAllVideos = () => revalidatePath("/all-videos");

export const createAllVideoAction = async (input: NewAllVideoParams) => {
  try {
    const payload = insertAllVideoParams.parse(input);
    await createAllVideo(payload);
    revalidateAllVideos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateAllVideoAction = async (input: UpdateAllVideoParams) => {
  try {
    const payload = updateAllVideoParams.parse(input);
    await updateAllVideo(payload.id, payload);
    revalidateAllVideos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteAllVideoAction = async (input: AllVideoId) => {
  try {
    const payload = allVideoIdSchema.parse({ id: input });
    await deleteAllVideo(payload.id);
    revalidateAllVideos();
  } catch (e) {
    return handleErrors(e);
  }
};