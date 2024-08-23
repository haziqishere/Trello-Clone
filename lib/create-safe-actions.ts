import { z } from "zod";

export type fieldErrors<T> = {
    [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
    fieldErrors?: fieldErrors<TInput>;
    error?: string | null;
    data?: TOutput;
}

export const createSafeAction = <TInput, TOuput>(

    schema: z.Schema<TInput>,
    handler: (validatedData: TInput) => Promise<ActionState<TInput, TOuput>>) => {
        return async (data: TInput) : Promise<ActionState<TInput, TOuput>> => {
            const validationResult  = schema.safeParse(data);
            if (!validationResult.success) {
                return {
                    fieldErrors: validationResult.error.flatten().fieldErrors as fieldErrors<TInput>
                };
            }
            return handler(validationResult.data); 
        }
}