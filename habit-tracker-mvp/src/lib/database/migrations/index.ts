import { Migration, migrationRunner } from './migration-utils'

// Import all migration files - temporarily commented out
// import { migration_001_create_profiles } from './001_create_profiles'
// import { migration_002_create_habits } from './002_create_habits'
// import { migration_003_create_habit_completions } from './003_create_habit_completions'
// import { migration_004_rls_profiles } from './004_rls_profiles'
// import { migration_005_rls_habits_completions } from './005_rls_habits_completions'

// Registry of all migrations in order - temporarily empty
export const migrations: Migration[] = [
  // migration_001_create_profiles,
  // migration_002_create_habits,
  // migration_003_create_habit_completions,
  // migration_004_rls_profiles,
  // migration_005_rls_habits_completions,
]

export class DatabaseMigrationManager {
  async runPendingMigrations(): Promise<void> {
    try {
      await migrationRunner.init()
      
      const executedMigrations = await migrationRunner.getMigrationHistory()
      const executedVersions = new Set(executedMigrations.map(m => m.version))
      
      const pendingMigrations = migrations.filter(
        migration => !executedVersions.has(migration.version)
      )
      
      if (pendingMigrations.length === 0) {
        console.log('No pending migrations')
        return
      }
      
      console.log(`Running ${pendingMigrations.length} pending migrations...`)
      
      for (const migration of pendingMigrations) {
        await migrationRunner.executeMigration(migration)
      }
      
      console.log('All migrations completed successfully')
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }

  async rollbackLastMigration(): Promise<void> {
    try {
      const executedMigrations = await migrationRunner.getMigrationHistory()
      
      if (executedMigrations.length === 0) {
        console.log('No migrations to rollback')
        return
      }
      
      const lastMigration = executedMigrations[executedMigrations.length - 1]
      if (!lastMigration) {
        console.log('No migrations to rollback')
        return
      }
      
      const migrationToRollback = migrations.find(m => m.id === lastMigration.id)
      
      if (!migrationToRollback) {
        throw new Error(`Migration ${lastMigration.id} not found in migration registry`)
      }
      
      await migrationRunner.rollbackMigration(migrationToRollback)
      console.log('Rollback completed successfully')
    } catch (error) {
      console.error('Rollback failed:', error)
      throw error
    }
  }

  async getMigrationStatus(): Promise<{
    total: number
    executed: number
    pending: number
    migrations: Array<{
      name: string
      version: number
      status: 'executed' | 'pending'
      executedAt?: string
    }>
  }> {
    const executedMigrations = await migrationRunner.getMigrationHistory()
    const executedVersions = new Set(executedMigrations.map(m => m.version))
    
    const migrationStatus = migrations.map(migration => {
      const executed = executedMigrations.find(m => m.version === migration.version)
      return {
        name: migration.name,
        version: migration.version,
        status: executedVersions.has(migration.version) ? 'executed' as const : 'pending' as const,
        ...(executed && { executedAt: executed.timestamp.toISOString() })
      }
    })
    
    return {
      total: migrations.length,
      executed: executedMigrations.length,
      pending: migrations.length - executedMigrations.length,
      migrations: migrationStatus
    }
  }
}

export const dbMigrationManager = new DatabaseMigrationManager() 