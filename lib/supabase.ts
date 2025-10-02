import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: string
          unit: 'weight' | 'reps' | 'time'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          unit: 'weight' | 'reps' | 'time'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          unit?: 'weight' | 'reps' | 'time'
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          date: string
          title: string | null
          notes: string | null
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          title?: string | null
          notes?: string | null
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          title?: string | null
          notes?: string | null
          duration?: number | null
          updated_at?: string
        }
      }
      workout_sets: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          set_number: number
          weight: number | null
          reps: number | null
          duration: number | null
          distance: number | null
          rpe: number | null
          completed: boolean
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          set_number: number
          weight?: number | null
          reps?: number | null
          duration?: number | null
          distance?: number | null
          rpe?: number | null
          completed?: boolean
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          set_number?: number
          weight?: number | null
          reps?: number | null
          duration?: number | null
          distance?: number | null
          rpe?: number | null
          completed?: boolean
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']