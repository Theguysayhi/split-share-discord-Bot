import { eq, isNull } from "drizzle-orm";
import { db } from "../index";
import { expenseSplits, type NewExpenseSplit, type ExpenseSplit } from "../schema";

export class ExpenseSplitRepository {
  /**
   * Find an expense split by its primary key.
   */
  async findById(id: number): Promise<ExpenseSplit | undefined> {
    const result = await db
      .select()
      .from(expenseSplits)
      .where(eq(expenseSplits.id, id));
    return result[0];
  }

  /**
   * Find all expense splits belonging to an expense group.
   */
  async findByGroupId(expenseGroupId: number): Promise<ExpenseSplit[]> {
    return db
      .select()
      .from(expenseSplits)
      .where(eq(expenseSplits.expenseGroupId, expenseGroupId));
  }

  /**
   * Find all unsettled expense splits (settledAt is null).
   */
  async findUnsettled(): Promise<ExpenseSplit[]> {
    return db
      .select()
      .from(expenseSplits)
      .where(isNull(expenseSplits.settledAt));
  }

  /**
   * Find all unsettled expense splits for a specific group.
   */
  async findUnsettledByGroupId(expenseGroupId: number): Promise<ExpenseSplit[]> {
    return db
      .select()
      .from(expenseSplits)
      .where(eq(expenseSplits.expenseGroupId, expenseGroupId));
  }

  /**
   * Return all expense splits.
   */
  async findAll(): Promise<ExpenseSplit[]> {
    return db.select().from(expenseSplits);
  }

  /**
   * Insert a new expense split and return it.
   */
  async create(data: NewExpenseSplit): Promise<ExpenseSplit> {
    const result = await db.insert(expenseSplits).values(data).returning();
    return result[0]!;
  }

  /**
   * Update an expense split and return the updated row.
   */
  async update(
    id: number,
    data: Partial<NewExpenseSplit>
  ): Promise<ExpenseSplit | undefined> {
    const result = await db
      .update(expenseSplits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(expenseSplits.id, id))
      .returning();
    return result[0];
  }

  /**
   * Mark an expense split as settled (sets settledAt to now).
   */
  async settle(id: number): Promise<ExpenseSplit | undefined> {
    const result = await db
      .update(expenseSplits)
      .set({ settledAt: new Date(), updatedAt: new Date() })
      .where(eq(expenseSplits.id, id))
      .returning();
    return result[0];
  }

  /**
   * Delete an expense split by its primary key.
   */
  async delete(id: number): Promise<void> {
    await db.delete(expenseSplits).where(eq(expenseSplits.id, id));
  }
}
