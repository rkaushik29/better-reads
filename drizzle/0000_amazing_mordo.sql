CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"email" text,
	"auth_id" text NOT NULL
);
