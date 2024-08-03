import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/videos/useOptimisticVideos";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import { type Video, insertVideoParams } from "@/lib/db/schema/videos";
import {
  createVideoAction,
  deleteVideoAction,
  updateVideoAction,
} from "@/lib/actions/videos";


const VideoForm = ({
  
  video,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  video?: Video | null;
  
  openModal?: (video?: Video) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Video>(insertVideoParams);
  const editing = !!video?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("videos");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Video },
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
      toast.success(`Video ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const videoParsed = await insertVideoParams.safeParseAsync({  ...payload });
    if (!videoParsed.success) {
      setErrors(videoParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = videoParsed.data;
    const pendingVideo: Video = {
      updatedAt: video?.updatedAt ?? new Date(),
      createdAt: video?.createdAt ?? new Date(),
      id: video?.id ?? "",
      userId: video?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingVideo,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateVideoAction({ ...values, id: video.id })
          : await createVideoAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingVideo 
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
          defaultValue={video?.name ?? ""}
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
            errors?.description ? "text-destructive" : "",
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={video?.description ?? ""}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">{errors.description[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: "delete", data: video });
              const error = await deleteVideoAction(video.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: video,
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

export default VideoForm;

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
