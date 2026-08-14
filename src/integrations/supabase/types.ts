export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      demos: {
        Row: {
          config: Json
          created_at: string
          institution: string
          notes: string | null
          published: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          institution: string
          notes?: string | null
          published?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          institution?: string
          notes?: string | null
          published?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          created_at: string
          guardian_id: string
          id: string
          kind: string
          student_id: string
        }
        Insert: {
          created_at?: string
          guardian_id: string
          id?: string
          kind: string
          student_id: string
        }
        Update: {
          created_at?: string
          guardian_id?: string
          id?: string
          kind?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mascot_library: {
        Row: {
          base_url: string
          created_at: string
          created_by: string | null
          emoji: string | null
          id: string
          kind: string | null
          manifest: Json
          name: string
          short_name: string | null
          thumb: string | null
          updated_at: string
        }
        Insert: {
          base_url: string
          created_at?: string
          created_by?: string | null
          emoji?: string | null
          id?: string
          kind?: string | null
          manifest?: Json
          name: string
          short_name?: string | null
          thumb?: string | null
          updated_at?: string
        }
        Update: {
          base_url?: string
          created_at?: string
          created_by?: string | null
          emoji?: string | null
          id?: string
          kind?: string | null
          manifest?: Json
          name?: string
          short_name?: string | null
          thumb?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      preinscripciones: {
        Row: {
          created_at: string
          email: string
          id: string
          slug: string
          user_agent: string | null
          utm: Json
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          slug?: string
          user_agent?: string | null
          utm?: Json
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          slug?: string
          user_agent?: string | null
          utm?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          daily_goal: number
          id: string
          level: number
          name: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          daily_goal?: number
          id: string
          level?: number
          name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          daily_goal?: number
          id?: string
          level?: number
          name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      progress: {
        Row: {
          lessons: Json
          level: number
          skill_errors: Json
          streak_days: Json
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          lessons?: Json
          level?: number
          skill_errors?: Json
          streak_days?: Json
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          lessons?: Json
          level?: number
          skill_errors?: Json
          streak_days?: Json
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_attempts: {
        Row: {
          ai_latency_ms: number | null
          ai_transcript: string
          attempt_number: number
          audio_bytes: number | null
          audio_expires_at: string | null
          audio_path: string | null
          created_at: string
          demo_slug: string
          duration_ms: number
          exercise_id: string
          feedback: Json
          fluency_score: number | null
          grammar_score: number | null
          id: string
          level: string
          local_latency_ms: number | null
          local_score: number | null
          local_transcript: string
          mode: string
          passed: boolean
          problem_words: Json
          pronunciation_score: number | null
          updated_at: string
          usage: Json
          user_id: string
          word_differences: Json
        }
        Insert: {
          ai_latency_ms?: number | null
          ai_transcript?: string
          attempt_number: number
          audio_bytes?: number | null
          audio_expires_at?: string | null
          audio_path?: string | null
          created_at?: string
          demo_slug: string
          duration_ms?: number
          exercise_id: string
          feedback?: Json
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          level: string
          local_latency_ms?: number | null
          local_score?: number | null
          local_transcript?: string
          mode: string
          passed?: boolean
          problem_words?: Json
          pronunciation_score?: number | null
          updated_at?: string
          usage?: Json
          user_id: string
          word_differences?: Json
        }
        Update: {
          ai_latency_ms?: number | null
          ai_transcript?: string
          attempt_number?: number
          audio_bytes?: number | null
          audio_expires_at?: string | null
          audio_path?: string | null
          created_at?: string
          demo_slug?: string
          duration_ms?: number
          exercise_id?: string
          feedback?: Json
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          level?: string
          local_latency_ms?: number | null
          local_score?: number | null
          local_transcript?: string
          mode?: string
          passed?: boolean
          problem_words?: Json
          pronunciation_score?: number | null
          updated_at?: string
          usage?: Json
          user_id?: string
          word_differences?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_guardian_of: {
        Args: { _guardian: string; _student: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "parent" | "teacher" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "parent", "teacher", "admin"],
    },
  },
} as const
