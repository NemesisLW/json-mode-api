import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodTypeAny } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jsonSchemaToZod(schema: any): ZodTypeAny {
  const type = determineSchemaType(schema);

  switch (type) {
    case "string":
      return z.string().nullable();
    case "number":
      return z.number().nullable();
    case "boolean":
      return z.boolean().nullable();
    case "array":
      return z.array(jsonSchemaToZod(schema.items)).nullable();
    case "object":
      const shape: Record<string, ZodTypeAny> = {};
      for (const key in schema) {
        if (key !== "type") {
          shape[key] = jsonSchemaToZod(schema[key]);
        }
      }
      return z.object(shape);
    default:
      throw new Error(`Unsupported data type: ${type}`);
  }
}

function determineSchemaType(schema: any) {
  //
  if (!schema.hasOwnProperty("type")) {
    //  Array does not exist on the type
    if (Array.isArray(schema)) {
      return "array";
    } else {
      return typeof schema;
    }
  }
  return schema.type;
}

export class RetryablePromise<T> extends Promise<T> {
  static async retry<T>(
    retries: number,
    executor: PromiseExecutor<T>
  ): Promise<T> {
    return new RetryablePromise<T>(executor).catch((e) => {
      console.error(`Retrying due to error: ${e}`);

      //   If we have retries left, retry the promise
      return retries > 0
        ? RetryablePromise.retry(retries - 1, executor)
        : Promise.reject(e);
    });
  }
}
