import axios from "axios";
import * as cheerio from "cheerio";
import { bookRepo } from "./books-repo";
import { UserBooksInsert, UserBooksUpdate } from "@/drizzle/schema";

async function create(data: UserBooksInsert) {
  await bookRepo.create(data);
}

async function find(userId: string) {
  return await bookRepo.find(userId);
}

async function remove(id: number) {
  await bookRepo.remove(id);
}

async function update(id: number, data: UserBooksUpdate) {
  await bookRepo.update(id, data);
}

const scrapeBookCovers = async (query: string) => {
  try {
    const searchUrl = `https://www.google.com/search?hl=en&tbm=isch&q=${encodeURIComponent(
      query
    )}&tbs=iar:portrait,itp:photo,isz:lt,islt:2mp`;

    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const imageUrls: string[] = [];

    $("img").each((index, element) => {
      if (imageUrls.length >= 10) return false;
      const imgSrc = $(element).attr("src");
      if (imgSrc?.startsWith("http")) {
        imageUrls.push(imgSrc);
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
  find,
  update,
  remove,
  scrapeBookCovers,
};
