import axios from "axios";
import * as cheerio from "cheerio";
import { bookRepo } from "./books-repo";
import { UserBooksInsert } from "@/drizzle/schema";

async function create(data: UserBooksInsert) {
  await bookRepo.create(data);
}

const scrapeBookCovers = async (query: string) => {
  try {
    const searchUrl = `https://www.google.com/search?hl=en&tbm=isch&q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);
    const imageUrls: string[] = [];

    $("img").each((index, element) => {
      if (index < 5) {
        const imgSrc = $(element).attr("src");
        if (imgSrc) {
          imageUrls.push(imgSrc);
        }
      }
    });

    return imageUrls;
  } catch (error) {
    console.error("Error scraping Google Images:", error);
    throw new Error("Failed to scrape images");
  }
};

export const bookService = {
  create,
  scrapeBookCovers,
};
