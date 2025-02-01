// components/BookSearchWithTag.tsx
import React, { useState, useRef, useEffect } from "react";
import BookSearchInput from "./BookSearchInput";
import TagChip from "./TagChip";
import { Search } from "lucide-react";

type SearchTag = "book" | "author";

const commandOptions: SearchTag[] = ["book", "author"];

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

// Helper function to fetch books from Google Books API
const fetchBooks = async (query: string, page: number) => {
  const startIndex = (page - 1) * 20;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number | null>(null);
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

  useEffect(() => {
    if (!showCommandDropdown && inputValue.trim() !== "") {
      const timer = setTimeout(() => {
        fetchBooks(inputValue, page)
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
  }, [inputValue, page, showCommandDropdown]);

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

  return (
    <div className="relative">
      <div className="flex items-center min-w-42 bg-white rounded-md overflow-hidden">
        {selectedTag && (
          <div className="pl-2 cursor-pointer">
            <TagChip
              label={selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)}
              color={selectedTag === "book" ? "blue" : "red"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            />
          </div>
        )}
        <BookSearchInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          icon={<Search />}
          placeholder="Search or type / for commands"
          className="flex-1 bg-white"
        />
      </div>

      {showCommandDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-white shadow rounded-md z-10">
          {commandOptions.map((option) => (
            <div
              key={option}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommandSelect(option);
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </div>
          ))}
        </div>
      )}

      {!showCommandDropdown && inputValue.trim() !== "" && (
        <div className="absolute left-0 right-0 mt-1 bg-white shadow rounded-md z-10 max-h-96 overflow-y-auto">
          {searchResults.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b border-gray-200"
              onMouseDown={(e) => e.preventDefault()}
            >
              {item.volumeInfo.title}
            </div>
          ))}
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
    </div>
  );
};

export default BookSearchWithTag;
