import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/all-videos/useOptimisticAllVideos";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type AllVideo, insertAllVideoParams } from "@/lib/db/schema/allVideos";
import {
  createAllVideoAction,
  deleteAllVideoAction,
  updateAllVideoAction,
} from "@/lib/actions/allVideos";
import { type Video, type VideoId } from "@/lib/db/schema/videos";

const AllVideoForm = ({
  videos,
  videoId,
  allVideo,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  allVideo?: AllVideo | null;
  videos: Video[];
  videoId?: VideoId
  openModal?: (allVideo?: AllVideo) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<AllVideo>(insertAllVideoParams);
  const editing = !!allVideo?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("all-videos");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: AllVideo },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`AllVideo ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const allVideoParsed = await insertAllVideoParams.safeParseAsync({ videoId, ...payload });
    if (!allVideoParsed.success) {
      setErrors(allVideoParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = allVideoParsed.data;
    const pendingAllVideo: AllVideo = {
      updatedAt: allVideo?.updatedAt ?? new Date(),
      createdAt: allVideo?.createdAt ?? new Date(),
      id: allVideo?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingAllVideo,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateAllVideoAction({ ...values, id: allVideo.id })
          : await createAllVideoAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingAllVideo 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={allVideo?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.url ? "text-destructive" : "",
          )}
        >
          Url
        </Label>
        <Input
          type="text"
          name="url"
          className={cn(errors?.url ? "ring ring-destructive" : "")}
          defaultValue={allVideo?.url ?? ""}
        />
        {errors?.url ? (
          <p className="text-xs text-destructive mt-2">{errors.url[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.numberOfTimes ? "text-destructive" : "",
          )}
        >
          Number Of Times
        </Label>
        <Input
          type="text"
          name="numberOfTimes"
          className={cn(errors?.numberOfTimes ? "ring ring-destructive" : "")}
          defaultValue={allVideo?.numberOfTimes ?? ""}
        />
        {errors?.numberOfTimes ? (
          <p className="text-xs text-destructive mt-2">{errors.numberOfTimes[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {videoId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.videoId ? "text-destructive" : "",
          )}
        >
          Video
        </Label>
        <Select defaultValue={allVideo?.videoId} name="videoId">
          <SelectTrigger
            className={cn(errors?.videoId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a video" />
          </SelectTrigger>
          <SelectContent>
          {videos?.map((video) => (
            <SelectItem key={video.id} value={video.id.toString()}>
              {video.id}{/* TODO: Replace with a field from the video model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.videoId ? (
          <p className="text-xs text-destructive mt-2">{errors.videoId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: allVideo });
              const error = await deleteAllVideoAction(allVideo.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: allVideo,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default AllVideoForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
