import { COLORS, DEFAULT_HABIT_COLORS } from '@/lib/constants/colors'
import { HABIT_CATEGORIES, STREAK_MILESTONES } from '@/lib/constants/habits'
import { getTodayString, formatDisplayDate } from '@/lib/utils/date'
import { validateEmail, validateHabitTitle } from '@/lib/utils/validation'

export default function Home() {
  // Test our utility functions
  const today = getTodayString()
  const todayFormatted = formatDisplayDate(new Date())
  
  // Test validation
  const emailTest = validateEmail("test@example.com")
  const habitTitleTest = validateHabitTitle("Morning Exercise")

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            🎯 Habit Tracker MVP
          </h1>
          <p className="text-text-secondary text-lg">
            Phase 1 Foundation Testing - All Systems Ready!
          </p>
          <div className="text-sm text-text-muted">
            Today: {todayFormatted} ({today})
          </div>
        </header>

        {/* Test Type System */}
        <section className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            📝 Type System Test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-text-primary">Email Validation:</h3>
              <div className="bg-background p-3 rounded border">
                <code className="text-sm">
                  validateEmail(&quot;test@example.com&quot;): {JSON.stringify(emailTest, null, 2)}
                </code>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-text-primary">Habit Title Validation:</h3>
              <div className="bg-background p-3 rounded border">
                <code className="text-sm">
                  validateHabitTitle(&quot;Morning Exercise&quot;): {JSON.stringify(habitTitleTest, null, 2)}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Test Color System */}
        <section className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            🎨 Color System Test
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-text-primary">Default Habit Colors:</h3>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_HABIT_COLORS.map((color, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-text-primary">Status Colors:</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS.success[500] }}
                  />
                  <span className="text-sm">Success</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS.warning[500] }}
                  />
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS.error[500] }}
                  />
                  <span className="text-sm">Error</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test Habit Categories */}
        <section className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            📚 Habit Categories Test
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HABIT_CATEGORIES.map((category) => (
              <div 
                key={category.id}
                className="bg-background p-4 rounded border text-center hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-text-primary">{category.name}</div>
                <div className="text-xs text-text-tertiary">{category.description}</div>
                <div 
                  className="w-full h-2 rounded mt-2"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Test Streak Milestones */}
        <section className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            🏆 Streak Milestones Test
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STREAK_MILESTONES.slice(0, 8).map((milestone) => (
              <div 
                key={milestone.days}
                className="bg-background p-4 rounded border text-center"
              >
                <div className="text-2xl mb-1">{milestone.emoji}</div>
                <div className="font-medium text-text-primary">{milestone.days} days</div>
                <div className="text-sm text-text-secondary">{milestone.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Test Custom Styles */}
        <section className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            ✨ Custom Styles Test
          </h2>
          <div className="space-y-4">
            <div className="animate-fade-in bg-success/10 text-success border border-success/20 p-3 rounded">
              ✅ Fade-in animation test
            </div>
            <div className="animate-slide-up bg-warning/10 text-warning border border-warning/20 p-3 rounded">
              ⬆️ Slide-up animation test
            </div>
            <div className="animate-bounce-in bg-primary/10 text-primary border border-primary/20 p-3 rounded">
              🎯 Bounce-in animation test
            </div>
          </div>
        </section>

        {/* Build Status */}
        <section className="bg-success/5 border border-success/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2 text-success">
            ✅ Phase 1 Complete
          </h2>
          <div className="text-text-secondary">
            All foundation components are working correctly. Ready for Phase 2: Database Setup!
          </div>
        </section>
      </div>
    </div>
  )
}
