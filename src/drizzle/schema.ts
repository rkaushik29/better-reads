import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  email: text("email"),
  authId: text("auth_id").notNull(),
});

export const user_books = pgTable("user_books", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  googleBookId: text("google_book_id").notNull(),
  title: text("title").notNull(),
  authors: text("authors"),
  publisher: text("publisher"),
  publishedDate: text("published_date"),
  category: text("category"),
  status: text("status"),
  description: text("description"),
  printedPageCount: integer("printed_page_count"),
  maturityRating: text("maturity_rating"),
  imageLinks: text("image_links"),
  previewLink: text("preview_link"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  rating: integer("rating"),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const annotations = pgTable("annotations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  bookId: text("book_id").notNull(),
  quote: text("quote"),
  annotation: text("annotation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ------------------------------------------------------------

/**
 * Create Select Schemas using drizzle-zod.
 */
export const userBooksSelectSchema = createSelectSchema(user_books);
export const annotationsSelectSchema = createSelectSchema(annotations);

/**
 * Create Insert Schemas using drizzle-zod.
 */
export const userBooksInsertSchema = createInsertSchema(user_books);
export const annotationsInsertSchema = createInsertSchema(annotations);

/**
 * Create Update Schemas using drizzle-zod.
 */
export const userBooksUpdateSchema = createUpdateSchema(user_books);
export const annotationsUpdateSchema = createUpdateSchema(annotations);

/**
 * Add refinements to the insert schemas.
 * For user_books, we require nonempty userId, googleBookId, and title.
 * Also, if provided, printedPageCount should be greater than 0.
 */
export const refinedUserBooksInsertSchema = userBooksInsertSchema
  .refine((data) => data.userId.trim().length > 0, {
    message: "User ID cannot be empty",
    path: ["userId"],
  })
  .refine((data) => data.googleBookId.trim().length > 0, {
    message: "Google Book ID cannot be empty",
    path: ["googleBookId"],
  })
  .refine((data) => data.title.trim().length > 0, {
    message: "Title cannot be empty",
    path: ["title"],
  })
  .refine(
    (data) =>
      data.printedPageCount === undefined ||
      data.printedPageCount === null ||
      data.printedPageCount > 0,
    {
      message: "Printed page count must be greater than 0 if provided",
      path: ["printedPageCount"],
    },
  );

/**
 * For annotations, we require nonempty userId and bookId.
 */
export const refinedAnnotationsInsertSchema = annotationsInsertSchema
  .refine((data) => data.userId.trim().length > 0, {
    message: "User ID cannot be empty",
    path: ["userId"],
  })
  .refine((data) => data.bookId.trim().length > 0, {
    message: "Book ID cannot be empty",
    path: ["bookId"],
  });

/**
 * Create Delete Schemas.
 * For deletion, we only need the primary key.
 */
export const userBooksDeleteSchema = z.object({
  id: z.number(),
});
export const annotationsDeleteSchema = z.object({
  id: z.number(),
});

/**
 * Export inferred types for type-safe usage elsewhere.
 */
export type UserBooksSelect = z.infer<typeof userBooksSelectSchema>;
export type UserBooksInsert = z.infer<typeof refinedUserBooksInsertSchema>;
export type UserBooksUpdate = z.infer<typeof userBooksUpdateSchema>;
export type UserBooksDelete = z.infer<typeof userBooksDeleteSchema>;

export type AnnotationsSelect = z.infer<typeof annotationsSelectSchema>;
export type AnnotationsInsert = z.infer<typeof refinedAnnotationsInsertSchema>;
export type AnnotationsUpdate = z.infer<typeof annotationsUpdateSchema>;
export type AnnotationsDelete = z.infer<typeof annotationsDeleteSchema>;

