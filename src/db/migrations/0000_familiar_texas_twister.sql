CREATE TABLE "expense_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"product_service" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_splits" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_group_id" integer NOT NULL,
	"creditor" varchar(255) NOT NULL,
	"debitor" varchar(255) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"settled_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_split_id" integer NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sent_by" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"server_id" varchar(255) NOT NULL,
	"channel_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expense_groups" ADD CONSTRAINT "expense_groups_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_splits" ADD CONSTRAINT "expense_splits_expense_group_id_expense_groups_id_fk" FOREIGN KEY ("expense_group_id") REFERENCES "public"."expense_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_expense_split_id_expense_splits_id_fk" FOREIGN KEY ("expense_split_id") REFERENCES "public"."expense_splits"("id") ON DELETE cascade ON UPDATE no action;