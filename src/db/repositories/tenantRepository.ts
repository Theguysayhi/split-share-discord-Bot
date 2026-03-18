import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { tenants, type NewTenant, type Tenant } from "../schema";

export class TenantRepository {
  /**
   * Find a tenant by its primary key.
   */
  async findById(id: number): Promise<Tenant | undefined> {
    const result = await db.select().from(tenants).where(eq(tenants.id, id));
    return result[0];
  }

  /**
   * Find a tenant by Discord server ID.
   */
  async findByServerId(serverId: string): Promise<Tenant | undefined> {
    const result = await db
      .select()
      .from(tenants)
      .where(eq(tenants.serverId, serverId));
    return result[0];
  }

  /**
   * Find a tenant by Discord server ID and channel ID.
   */
  async findByServerAndChannelId(
    serverId: string,
    channelId: string
  ): Promise<Tenant | undefined> {
    const result = await db
      .select()
      .from(tenants)
      .where(and(eq(tenants.serverId, serverId), eq(tenants.channelId, channelId)));
    return result[0];
  }

  /**
   * Return all tenants.
   */
  async findAll(): Promise<Tenant[]> {
    return db.select().from(tenants);
  }

  /**
   * Insert a new tenant and return it.
   */
  async create(data: NewTenant): Promise<Tenant> {
    const result = await db.insert(tenants).values(data).returning();
    return result[0]!;
  }

  /**
   * Update an existing tenant and return the updated row.
   */
  async update(
    id: number,
    data: Partial<NewTenant>
  ): Promise<Tenant | undefined> {
    const result = await db
      .update(tenants)
      .set(data)
      .where(eq(tenants.id, id))
      .returning();
    return result[0];
  }

  /**
   * Delete a tenant by its primary key.
   */
  async delete(id: number): Promise<void> {
    await db.delete(tenants).where(eq(tenants.id, id));
  }
}
