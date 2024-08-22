"use server";

import { z } from "zod";

import { db }  from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    title?: string[];
  },
  messgae?: string | null;
}

const CreateBoard = z.object({
    title: z.string().min(3, {
      message: "Minimum length of 3 letters are required",
    })
});

export async function create(prevState: State, formData: FormData) {
    const validatedField = CreateBoard.safeParse({
        title: formData.get("title"),
    });

    if (!validatedField.success) {
      return {

        errors: validatedField.error.flatten().fieldErrors,
        message: "Missing fields"
      }
    }

    const { title } = validatedField.data;

    try {
      await db.board.create({
        data: {
          title,
        },
      });
    }catch (error) {
      return {
        message: "Database error",
      }
    }
    revalidatePath("/organization/org_2kxOMD0ntA3cM6exOQcc1ZxfZYS");
    redirect("/organization/org_2kxOMD0ntA3cM6exOQcc1ZxfZYS");
  }