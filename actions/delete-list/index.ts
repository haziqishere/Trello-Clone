"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { DeleteList } from "./schema";
import { createAuditLog } from "@/lib/ceate-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    
    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        }
    }

    const {id, boardId } = data;
    let list;

    try {
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                }
            },
        });
        await createAuditLog({
            entityTitle: list.title,
            entityId: list.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE
        })
    } catch (error) {
        return {
            error: "Failed to deletes list"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list }
};

export const deleteList = createSafeAction(DeleteList, handler);