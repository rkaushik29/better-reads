import axios from "axios";
import * as cheerio from "cheerio";

const scrapeBookCovers = async (title: string) => {
  const searchUrl = `https://www.example.com/search?q=${encodeURIComponent(title)}`;
  const { data } = await axios.get(searchUrl);
  const $ = cheerio.load(data);
  const covers: string[] = [];

  // Adjust the selector based on the website's structure
  $(".book-cover-selector").each((index, element) => {
    if (index < 5) {
      const imgSrc = $(element).attr("src");
      if (imgSrc) {
        covers.push(imgSrc);
      }
    }
  });

  return covers;
};

export const bookService = {
  scrapeBookCovers,
};
