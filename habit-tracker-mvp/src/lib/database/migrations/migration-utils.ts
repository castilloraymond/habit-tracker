import { createClient } from '@/lib/supabase/server'

export interface Migration {
  id: string
  name: string
  up: string
  down: string
  version: number
  timestamp: Date
}

export class MigrationRunner {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  async init() {
    // Create migrations table if it doesn't exist
    const { error } = await (await this.supabase).rpc('create_migrations_table', {})
    if (error && !error.message.includes('already exists')) {
      throw error
    }
  }

  async getMigrationHistory(): Promise<Migration[]> {
    const { data, error } = await (await this.supabase)
      .from('migrations')
      .select('*')
      .order('version', { ascending: true })

    if (error) throw error
    return data || []
  }

  async recordMigration(migration: Migration): Promise<void> {
    const { error } = await (await this.supabase)
      .from('migrations')
      .insert({
        id: migration.id,
        name: migration.name,
        version: migration.version,
        executed_at: migration.timestamp.toISOString()
      })

    if (error) throw error
  }

  async removeMigration(migrationId: string): Promise<void> {
    const { error } = await (await this.supabase)
      .from('migrations')
      .delete()
      .eq('id', migrationId)

    if (error) throw error
  }

  async executeMigration(migration: Migration): Promise<void> {
    try {
      // Execute the migration SQL
      const { error } = await (await this.supabase).rpc('execute_migration', {
        migration_sql: migration.up
      })

      if (error) throw error

      // Record successful execution
      await this.recordMigration(migration)
      console.log(`Migration ${migration.name} executed successfully`)
    } catch (error) {
      console.error(`Migration ${migration.name} failed:`, error)
      throw error
    }
  }

  async rollbackMigration(migration: Migration): Promise<void> {
    try {
      // Execute the rollback SQL
      const { error } = await (await this.supabase).rpc('execute_migration', {
        migration_sql: migration.down
      })

      if (error) throw error

      // Remove from migration history
      await this.removeMigration(migration.id)
      console.log(`Migration ${migration.name} rolled back successfully`)
    } catch (error) {
      console.error(`Rollback of ${migration.name} failed:`, error)
      throw error
    }
  }
}

export const migrationRunner = new MigrationRunner() 