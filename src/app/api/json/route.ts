import { EXAMPLE_ANSWER, EXAMPLE_PROMPT, openai } from "@/lib/ai";
import { inputDataSchema } from "@/lib/schema";
import { jsonSchemaToZod } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  // Unstructred Data Input - JSON Output Format
  const { data, format } = inputDataSchema.parse(body);
  // Create Schema for the expected user output format
  const dynamicSchema = jsonSchemaToZod(format);

  const content = `DATA: \n"${data}"\n\n-----------\nExpected JSON format: ${JSON.stringify(
    format,
    null,
    2
  )}\n\n-----------\nValid JSON output in expected format:`;

  //   Retry Mechanism
  const validatedResult = await RetryablePromise.retry(
    3,
    async (resolve, reject) => {
      try {
        const result = await openai.chat.completions.create({
          model: "mistralai/Mixtral-8x22B-Instruct-v0.1",
          messages: [
            {
              role: "system",
              content:
                "You are an AI that converts unstructured data into the attached JSON format. You respond with nothing but valid JSON based on the input data. Your output should DIRECTLY be valid JSON, nothing added before or after. You will begin right with the opening curly brace and end with the closing curly brace. Only if you absolutely cannot determine a field, use the value null.",
            },
            {
              role: "user",
              content: EXAMPLE_PROMPT,
            },
            {
              role: "assistant",
              content: EXAMPLE_ANSWER,
            },
            {
              role: "user",
              content,
            },
          ],
        });
        const text = result.choices[0].message.content;
        const parsedResult = dynamicSchema.parse(JSON.parse(text || ""));
        return resolve(parsedResult);
      } catch (e) {
        reject(e);
      }
    }
  );
  return NextResponse.json(validatedResult, { status: 200 });
};
