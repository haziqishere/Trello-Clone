import { z } from "zod";
import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-actions";
import { UpdateCard } from "./schema";
import { Action } from "@prisma/client/runtime/library";

export type InputType = z.infer<typeof UpdateCard>;
export type ReturnType = ActionState<InputType,Card>;