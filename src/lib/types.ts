type PromiseExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void;

type JSONSchemaType =
  | { type: "string"; minLength?: number; maxLength?: number; pattern?: string }
  | { type: "number"; minimum?: number; maximum?: number }
  | { type: "boolean" }
  | {
      type: "array";
      items: JSONSchemaType;
      minItems?: number;
      maxItems?: number;
    }
  | {
      type: "object";
      properties: Record<string, JSONSchemaType>;
      required?: string[];
    };

type Format = {
  [key: string]: JSONSchemaType;
};
