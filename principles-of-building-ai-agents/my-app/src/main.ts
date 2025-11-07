import { Agent } from "@mastra/core";
import dotenv from "dotenv";
import path from "path";
import {z} from "zod";

dotenv.config({ path: path.join(__dirname, "../.env") });


const schema = z.object({
    name: z.string().min(2).max(100),
    instructions: z.string().min(10).max(500),
    model: z.string().min(2).max(100),
});

const agent = new Agent({
  name: "my-agent",
  instructions: "You are a helpful assistant",
  model: "google/gemini-1.5-pro-latest", 
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  headers: {
    "X-Custom-Header": "value"
  }
});


const response = await agent.generate("Hello!");

const stream = await agent.stream("Tell me a story");
for await (const chunk of stream) {
  console.log(chunk);
}

console.log("Response:", response.objects[0].text);