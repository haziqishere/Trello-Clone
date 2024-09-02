"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-actions";
import { createAuditLog } from "@/lib/ceate-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const canCreate = await hasAvailableCount();

  if (!canCreate) {
    return {
      error: "You have reached the maximum number of free boards. Please upgrade for more"
    }
  }

  const { title, image } = data;


  const [
    imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName
  ] = image.split("|");
  let board;
  console.log({ imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName });
  
  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
    return {
      error: "Missing fields. Failed to create board"
    }
  }

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
      },
    });

    await incrementAvailableCount();

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE
  })
  } catch (error) {
    return {
      error: "Failed to create board.",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return {data: board};
};

export const createBoard = createSafeAction(CreateBoard, handler);