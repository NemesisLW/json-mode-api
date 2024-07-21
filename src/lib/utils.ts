import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodTypeAny } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a JSON schema to a Zod schema for validation
 * @param schema - The input JSON schema
 * @returns A Zod schema corresponding to the input JSON schema
 */

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

/**
 * A Promise class with built-in retry functionality
 */
export class RetryablePromise<T> extends Promise<T> {
  /**
   * Retries a promise-based operation a specified number of times
   * @param retries - The number of retry attempts
   * @param executor - The promise executor function
   * @returns A promise that resolves with the operation result or rejects after all retries are exhausted
   */

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
