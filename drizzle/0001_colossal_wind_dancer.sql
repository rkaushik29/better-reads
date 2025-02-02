CREATE TABLE "annotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"book_id" text NOT NULL,
	"quote" text,
	"annotation" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"google_book_id" text NOT NULL,
	"title" text NOT NULL,
	"authors" text,
	"publisher" text,
	"published_date" text,
	"category" text,
	"status" text,
	"description" text,
	"printed_page_count" integer,
	"maturity_rating" text,
	"image_links" text,
	"preview_link" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"rating" integer,
	"review" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
