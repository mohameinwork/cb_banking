CREATE TABLE "quotation_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quotation_id" uuid NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_account_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"paid_amount" numeric(18, 2) DEFAULT '0.00',
	"items" jsonb NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"status" text DEFAULT 'DRAFT',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "balance" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "ledger_account_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "company_account_id" uuid;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD COLUMN "transaction_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "quotation_payments" ADD CONSTRAINT "quotation_payments_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "user_id";