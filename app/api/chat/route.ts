import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: {
    messages: UIMessage[];
    model: string;
    webSearch: boolean;
  } = await req.json();

  const bedrock = createAmazonBedrock({
    region: "us-west-2",
    apiKey: process.env.BEDROCK_API_KEY,
  });

  const result = streamText({
    model: bedrock(model),
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful and capable assistant. Follow the user instructions carefully and thoroughly. Always respond in the same language that the user is using.",
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
