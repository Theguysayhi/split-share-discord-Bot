import { eq } from "drizzle-orm";
import { db } from "../index";
import { notes, type NewNote, type Note } from "../schema";

export class NoteRepository {
  /**
   * Find a note by its primary key.
   */
  async findById(id: number): Promise<Note | undefined> {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0];
  }

  /**
   * Find all notes attached to a specific expense split.
   */
  async findByExpenseSplitId(expenseSplitId: number): Promise<Note[]> {
    return db
      .select()
      .from(notes)
      .where(eq(notes.expenseSplitId, expenseSplitId));
  }

  /**
   * Insert a new note and return it.
   */
  async create(data: NewNote): Promise<Note> {
    const result = await db.insert(notes).values(data).returning();
    return result[0]!;
  }

  /**
   * Delete a note by its primary key.
   */
  async delete(id: number): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  /**
   * Delete all notes for a specific expense split.
   */
  async deleteByExpenseSplitId(expenseSplitId: number): Promise<void> {
    await db.delete(notes).where(eq(notes.expenseSplitId, expenseSplitId));
  }
}
