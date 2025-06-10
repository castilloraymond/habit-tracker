// Habit-related constants and templates

import type { HabitCategory } from '../types/habit'
import { HABIT_COLORS } from './colors'

// Default habit categories with metadata
export const HABIT_CATEGORIES = [
  {
    id: 'health' as HabitCategory,
    name: 'Health',
    description: 'Physical health and wellness habits',
    color: HABIT_COLORS.health,
    icon: '🏥',
  },
  {
    id: 'fitness' as HabitCategory,
    name: 'Fitness',
    description: 'Exercise and physical activity habits',
    color: HABIT_COLORS.fitness,
    icon: '💪',
  },
  {
    id: 'productivity' as HabitCategory,
    name: 'Productivity',
    description: 'Work and productivity habits',
    color: HABIT_COLORS.productivity,
    icon: '⚡',
  },
  {
    id: 'learning' as HabitCategory,
    name: 'Learning',
    description: 'Education and skill development habits',
    color: HABIT_COLORS.learning,
    icon: '📚',
  },
  {
    id: 'social' as HabitCategory,
    name: 'Social',
    description: 'Relationships and social habits',
    color: HABIT_COLORS.social,
    icon: '👥',
  },
  {
    id: 'mindfulness' as HabitCategory,
    name: 'Mindfulness',
    description: 'Mental health and mindfulness habits',
    color: HABIT_COLORS.mindfulness,
    icon: '🧘',
  },
  {
    id: 'creativity' as HabitCategory,
    name: 'Creativity',
    description: 'Creative and artistic habits',
    color: HABIT_COLORS.creativity,
    icon: '🎨',
  },
  {
    id: 'other' as HabitCategory,
    name: 'Other',
    description: 'Miscellaneous habits',
    color: HABIT_COLORS.other,
    icon: '📝',
  },
] as const

// Pre-defined habit templates for quick setup
export const HABIT_TEMPLATES = [
  // Health habits
  {
    title: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'health' as HabitCategory,
    color: HABIT_COLORS.health,
    target_frequency: 1,
  },
  {
    title: 'Take vitamins',
    description: 'Daily vitamin and supplement routine',
    category: 'health' as HabitCategory,
    color: HABIT_COLORS.health,
    target_frequency: 1,
  },
  {
    title: 'Get 8 hours of sleep',
    description: 'Maintain a healthy sleep schedule',
    category: 'health' as HabitCategory,
    color: HABIT_COLORS.health,
    target_frequency: 1,
  },
  
  // Fitness habits
  {
    title: 'Morning workout',
    description: '30-minute exercise session',
    category: 'fitness' as HabitCategory,
    color: HABIT_COLORS.fitness,
    target_frequency: 1,
  },
  {
    title: 'Take 10,000 steps',
    description: 'Daily walking goal',
    category: 'fitness' as HabitCategory,
    color: HABIT_COLORS.fitness,
    target_frequency: 1,
  },
  {
    title: 'Stretch for 10 minutes',
    description: 'Daily stretching routine',
    category: 'fitness' as HabitCategory,
    color: HABIT_COLORS.fitness,
    target_frequency: 1,
  },
  
  // Productivity habits
  {
    title: 'Review daily goals',
    description: 'Plan and review daily objectives',
    category: 'productivity' as HabitCategory,
    color: HABIT_COLORS.productivity,
    target_frequency: 1,
  },
  {
    title: 'Clean workspace',
    description: 'Organize and tidy work area',
    category: 'productivity' as HabitCategory,
    color: HABIT_COLORS.productivity,
    target_frequency: 1,
  },
  {
    title: 'Time blocking',
    description: 'Plan day with time blocks',
    category: 'productivity' as HabitCategory,
    color: HABIT_COLORS.productivity,
    target_frequency: 1,
  },
  
  // Learning habits
  {
    title: 'Read for 30 minutes',
    description: 'Daily reading habit',
    category: 'learning' as HabitCategory,
    color: HABIT_COLORS.learning,
    target_frequency: 1,
  },
  {
    title: 'Practice a new language',
    description: 'Language learning session',
    category: 'learning' as HabitCategory,
    color: HABIT_COLORS.learning,
    target_frequency: 1,
  },
  {
    title: 'Watch educational content',
    description: 'Learn something new online',
    category: 'learning' as HabitCategory,
    color: HABIT_COLORS.learning,
    target_frequency: 1,
  },
  
  // Social habits
  {
    title: 'Call family/friends',
    description: 'Stay connected with loved ones',
    category: 'social' as HabitCategory,
    color: HABIT_COLORS.social,
    target_frequency: 1,
  },
  {
    title: 'Practice gratitude',
    description: 'Express gratitude to someone',
    category: 'social' as HabitCategory,
    color: HABIT_COLORS.social,
    target_frequency: 1,
  },
  
  // Mindfulness habits
  {
    title: 'Meditate for 10 minutes',
    description: 'Daily meditation practice',
    category: 'mindfulness' as HabitCategory,
    color: HABIT_COLORS.mindfulness,
    target_frequency: 1,
  },
  {
    title: 'Practice deep breathing',
    description: 'Breathing exercises for relaxation',
    category: 'mindfulness' as HabitCategory,
    color: HABIT_COLORS.mindfulness,
    target_frequency: 1,
  },
  {
    title: 'Journal writing',
    description: 'Reflect and write in journal',
    category: 'mindfulness' as HabitCategory,
    color: HABIT_COLORS.mindfulness,
    target_frequency: 1,
  },
  
  // Creativity habits
  {
    title: 'Draw or sketch',
    description: 'Creative drawing practice',
    category: 'creativity' as HabitCategory,
    color: HABIT_COLORS.creativity,
    target_frequency: 1,
  },
  {
    title: 'Write creatively',
    description: 'Creative writing session',
    category: 'creativity' as HabitCategory,
    color: HABIT_COLORS.creativity,
    target_frequency: 1,
  },
  {
    title: 'Play music',
    description: 'Practice musical instrument',
    category: 'creativity' as HabitCategory,
    color: HABIT_COLORS.creativity,
    target_frequency: 1,
  },
] as const

// Default settings for new habits
export const DEFAULT_HABIT_SETTINGS = {
  target_frequency: 1,
  color: HABIT_COLORS.productivity,
  category: 'other' as HabitCategory,
  is_active: true,
} as const

// Habit frequency options
export const FREQUENCY_OPTIONS = [
  { value: 1, label: 'Once a day', description: 'Complete once per day' },
  { value: 2, label: 'Twice a day', description: 'Complete twice per day' },
  { value: 3, label: '3 times a day', description: 'Complete 3 times per day' },
  { value: 4, label: '4 times a day', description: 'Complete 4 times per day' },
  { value: 5, label: '5 times a day', description: 'Complete 5 times per day' },
] as const

// Streak milestones for celebrations
export const STREAK_MILESTONES = [
  { days: 3, title: 'Getting Started!', emoji: '🌱', message: 'Great start! Keep it up!' },
  { days: 7, title: 'One Week Strong!', emoji: '🔥', message: 'A full week of consistency!' },
  { days: 14, title: 'Two Weeks!', emoji: '💪', message: 'You\'re building a solid habit!' },
  { days: 21, title: 'Three Weeks!', emoji: '⭐', message: 'Habit formation in progress!' },
  { days: 30, title: 'One Month!', emoji: '🎉', message: 'A full month of dedication!' },
  { days: 50, title: 'Fifty Days!', emoji: '🏆', message: 'You\'re unstoppable!' },
  { days: 100, title: 'Century Club!', emoji: '💯', message: 'One hundred days of excellence!' },
  { days: 365, title: 'One Year!', emoji: '🎊', message: 'A full year of commitment!' },
] as const

// Completion rate thresholds
export const COMPLETION_THRESHOLDS = {
  excellent: 90,
  good: 75,
  fair: 50,
  poor: 25,
} as const

// Time of day options for habit scheduling
export const TIME_OF_DAY_OPTIONS = [
  { value: 'morning', label: 'Morning', description: '6:00 AM - 12:00 PM' },
  { value: 'afternoon', label: 'Afternoon', description: '12:00 PM - 6:00 PM' },
  { value: 'evening', label: 'Evening', description: '6:00 PM - 10:00 PM' },
  { value: 'anytime', label: 'Anytime', description: 'No specific time' },
] as const

// Helper functions
export function getCategoryById(categoryId: HabitCategory) {
  return HABIT_CATEGORIES.find(cat => cat.id === categoryId)
}

export function getTemplatesByCategory(categoryId: HabitCategory) {
  return HABIT_TEMPLATES.filter(template => template.category === categoryId)
}

export function getStreakMilestone(streakDays: number) {
  return STREAK_MILESTONES
    .filter(milestone => streakDays >= milestone.days)
    .pop() // Get the highest milestone achieved
}

export function getCompletionRating(completionRate: number): string {
  if (completionRate >= COMPLETION_THRESHOLDS.excellent) return 'excellent'
  if (completionRate >= COMPLETION_THRESHOLDS.good) return 'good'
  if (completionRate >= COMPLETION_THRESHOLDS.fair) return 'fair'
  return 'poor'
} 