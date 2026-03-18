import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Tenants ─────────────────────────────────────────────────────────────────
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  serverId: varchar("server_id", { length: 255 }).notNull(),
  channelId: varchar("channel_id", { length: 255 }).notNull(),
});

// ─── ExpenseGroups ────────────────────────────────────────────────────────────
export const expenseGroups = pgTable("expense_groups", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  productService: varchar("product_service", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});

// ─── ExpenseSplits ────────────────────────────────────────────────────────────
export const expenseSplits = pgTable("expense_splits", {
  id: serial("id").primaryKey(),
  expenseGroupId: integer("expense_group_id")
    .notNull()
    .references(() => expenseGroups.id, { onDelete: "cascade" }),
  creditor: varchar("creditor", { length: 255 }).notNull(),
  debitor: varchar("debitor", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  settledAt: timestamp("settled_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Notes ────────────────────────────────────────────────────────────────────
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  expenseSplitId: integer("expense_split_id")
    .notNull()
    .references(() => expenseSplits.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  sentBy: varchar("sent_by", { length: 255 }).notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const tenantsRelations = relations(tenants, ({ many }) => ({
  expenseGroups: many(expenseGroups),
}));

export const expenseGroupsRelations = relations(
  expenseGroups,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [expenseGroups.tenantId],
      references: [tenants.id],
    }),
    expenseSplits: many(expenseSplits),
  })
);

export const expenseSplitsRelations = relations(
  expenseSplits,
  ({ one, many }) => ({
    expenseGroup: one(expenseGroups, {
      fields: [expenseSplits.expenseGroupId],
      references: [expenseGroups.id],
    }),
    notes: many(notes),
  })
);

export const notesRelations = relations(notes, ({ one }) => ({
  expenseSplit: one(expenseSplits, {
    fields: [notes.expenseSplitId],
    references: [expenseSplits.id],
  }),
}));

// ─── Inferred Types ───────────────────────────────────────────────────────────
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type ExpenseGroup = typeof expenseGroups.$inferSelect;
export type NewExpenseGroup = typeof expenseGroups.$inferInsert;

export type ExpenseSplit = typeof expenseSplits.$inferSelect;
export type NewExpenseSplit = typeof expenseSplits.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
