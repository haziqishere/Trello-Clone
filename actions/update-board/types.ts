import { z } from "zod";
import { Board } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";
import { UpdateBoard } from "./schema";
import { Action } from "@prisma/client/runtime/library";

export type InputType = z.infer<typeof UpdateBoard>;
export type ReturnType = ActionState<InputType,Board>;