import React, { useState, useRef, useEffect } from "react";
import BookSearchInput from "./BookSearchInput";
import TagChip from "./TagChip";
import { Search } from "lucide-react";

import BookDialog from "./BookDialog";
import { api } from "@/utils/trpc";

type SearchTag = "book" | "author";

const commandOptions: SearchTag[] = ["book", "author"];

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

const fetchBooks = async (
  query: string,
  page: number,
  tag: SearchTag | null,
) => {
  const startIndex = (page - 1) * 20;
  const searchQuery = tag ? `in${tag}:${query}` : query;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    searchQuery,
  )}&key=${API_KEY}&maxResults=20&startIndex=${startIndex}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
};

export const BookSearchWithTag: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<SearchTag | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showCommandDropdown, setShowCommandDropdown] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (!selectedTag && inputValue.startsWith("/")) {
      setShowCommandDropdown(true);
    } else {
      setShowCommandDropdown(false);
    }
  }, [inputValue, selectedTag]);

  useEffect(() => {
    if (!showCommandDropdown && inputValue.trim() !== "") {
      setPage(1);
    } else {
      setSearchResults([]);
      setTotalItems(null);
    }
  }, [inputValue, showCommandDropdown]);

  // Debounced API call.
  useEffect(() => {
    if (!showCommandDropdown && inputValue.trim() !== "") {
      const timer = setTimeout(() => {
        fetchBooks(inputValue, page, selectedTag)
          .then((data) => {
            if (page === 1) {
              setSearchResults(data.items || []);
            } else {
              setSearchResults((prev) => [...prev, ...(data.items || [])]);
            }
            setTotalItems(data.totalItems);
          })
          .catch((err) => console.error(err));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputValue, page, showCommandDropdown, selectedTag]);

  const handleCommandSelect = (option: SearchTag) => {
    setSelectedTag(option);
    const newValue = inputValue.replace(/^\/+/, "");
    setInputValue(newValue);
    setShowCommandDropdown(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResultClick = (item: any) => {
    if (item.selfLink) {
      localStorage.setItem("selectedBookSelfLink", item.selfLink);
    }
    setSelectedBook(item);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  

  return (
    <div className="relative w-full mt-4">
      <div className="flex flex-row gap-2 w-full">
        {selectedTag && (
          <div className="flex items-center justify-center cursor-pointer">
            <TagChip
              label={selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)}
              color={selectedTag === "book" ? "blue" : "red"}
              size="md"
              onClick={() => setSelectedTag(null)}
            />
          </div>
        )}
        <div className="flex flex-1 items-center bg-white rounded-md overflow-hidden">
          <BookSearchInput
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            icon={<Search />}
            placeholder="Search or type / for commands"
            className="w-full bg-white"
          />
        </div>
      </div>

      {showCommandDropdown && (
        <div className="absolute w-full mt-1 bg-white shadow rounded-md z-20">
          {commandOptions.map((option) => (
            <div
              key={option}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommandSelect(option);
              }}
            >
              /{option} - Search by {option}
            </div>
          ))}
        </div>
      )}

      {!showCommandDropdown && inputValue.trim() !== "" && (
        <div className="mt-1 bg-white shadow rounded-md z-10 max-h-96 overflow-y-auto">
          {searchResults.map((item) => {
            const title = item.volumeInfo?.title || "No title";
            const authors =
              item.volumeInfo?.authors?.join(", ") || "Unknown author";
            return (
              <div
                key={item.id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
                onClick={() => handleResultClick(item)}
              >
                <div className="font-medium">{title}</div>
                <div className="text-xs text-gray-500">{authors}</div>
              </div>
            );
          })}
          {totalItems !== null && searchResults.length < totalItems && (
            <div
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-center font-medium"
              onMouseDown={(e) => {
                e.preventDefault();
                handleLoadMore();
              }}
            >
              Load more
            </div>
          )}
          {searchResults.length === 0 && (
            <div className="px-4 py-2 text-gray-500">No results found.</div>
          )}
        </div>
      )}

      {!showCommandDropdown && inputValue.trim() === "" && (
        <div className="mt-1 bg-white shadow rounded-md z-10 p-4 text-center text-gray-500">
          No recent searches.
        </div>
      )}

      {selectedBook && (
        <BookDialog
          book={selectedBook}
          open={true}
          onOpenChange={(open) => !open && closeModal()}
        />
      )}
    </div>
  );
};

export default BookSearchWithTag;
