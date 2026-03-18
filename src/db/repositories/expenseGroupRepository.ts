import { eq } from "drizzle-orm";
import { db } from "../index";
import { expenseGroups, type NewExpenseGroup, type ExpenseGroup } from "../schema";

export class ExpenseGroupRepository {
  /**
   * Find an expense group by its primary key.
   */
  async findById(id: number): Promise<ExpenseGroup | undefined> {
    const result = await db
      .select()
      .from(expenseGroups)
      .where(eq(expenseGroups.id, id));
    return result[0];
  }

  /**
   * Find all expense groups belonging to a tenant.
   */
  async findByTenantId(tenantId: number): Promise<ExpenseGroup[]> {
    return db
      .select()
      .from(expenseGroups)
      .where(eq(expenseGroups.tenantId, tenantId));
  }

  /**
   * Return all expense groups.
   */
  async findAll(): Promise<ExpenseGroup[]> {
    return db.select().from(expenseGroups);
  }

  /**
   * Insert a new expense group and return it.
   */
  async create(data: NewExpenseGroup): Promise<ExpenseGroup> {
    const result = await db.insert(expenseGroups).values(data).returning();
    return result[0]!;
  }

  /**
   * Update an expense group and return the updated row.
   */
  async update(
    id: number,
    data: Partial<NewExpenseGroup>
  ): Promise<ExpenseGroup | undefined> {
    const result = await db
      .update(expenseGroups)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(expenseGroups.id, id))
      .returning();
    return result[0];
  }

  /**
   * Delete an expense group by its primary key.
   */
  async delete(id: number): Promise<void> {
    await db.delete(expenseGroups).where(eq(expenseGroups.id, id));
  }
}
