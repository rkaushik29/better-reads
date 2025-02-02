// bookAiService.ts

import { OpenAI } from "openai";

/**
 * Fetch a short snippe t of info about a book using the OpenAI API.
 *
 * @param title - The book title
 * @param author - The book’s author
 * @returns A short text snippet describing or summarizing the book.
 */
export async function getBookSnippet(title: string, author: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found in environment variables.");
  }

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Give me a concise, engaging, and spoiler-free snippet about the book "${title}" by ${author}. Keep it under 50 words.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a book lover who is concise and engaging in reporting book information" },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    // Extract the snippet from the response
    const snippet = response.choices[0].message?.content ?? "";
    return snippet.trim();
  } catch (error) {
    console.error("Error fetching book snippet from OpenAI:", error);
    throw new Error("Failed to fetch book snippet");
  }
}