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
      activities: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          legacy_id: number | null
          link: string | null
          points: number
          title: string
          translations: Json
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          legacy_id?: number | null
          link?: string | null
          points?: number
          title: string
          translations?: Json
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          legacy_id?: number | null
          link?: string | null
          points?: number
          title?: string
          translations?: Json
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          id: string
          progress: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          activity_id: string | null
          challenge_type: string
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          organization_id: string | null
          start_date: string | null
          status: string
          target_value: number | null
          team_id: string | null
          title: string
          unit: string | null
          updated_at: string
          visibility: string
        }
        Insert: {
          activity_id?: string | null
          challenge_type?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string | null
          start_date?: string | null
          status?: string
          target_value?: number | null
          team_id?: string | null
          title: string
          unit?: string | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          activity_id?: string | null
          challenge_type?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string | null
          start_date?: string | null
          status?: string
          target_value?: number | null
          team_id?: string | null
          title?: string
          unit?: string | null
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          activity_id: string | null
          challenge_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          challenge_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string | null
          challenge_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          subject: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          subject: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          subject?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          language: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          language?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          language?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      performed_exercises: {
        Row: {
          activity_id: string | null
          amount: number
          challenge_id: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          note: string | null
          performed_at: string
          points: number
          unit: string | null
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          amount?: number
          challenge_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          note?: string | null
          performed_at?: string
          points?: number
          unit?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string | null
          amount?: number
          challenge_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          note?: string | null
          performed_at?: string
          points?: number
          unit?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performed_exercises_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          language: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          language?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          language?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_answers: {
        Row: {
          answer_text: string | null
          answer_value: number | null
          created_at: string
          id: string
          question_id: string | null
          survey_id: string
          user_id: string
        }
        Insert: {
          answer_text?: string | null
          answer_value?: number | null
          created_at?: string
          id?: string
          question_id?: string | null
          survey_id: string
          user_id: string
        }
        Update: {
          answer_text?: string | null
          answer_value?: number | null
          created_at?: string
          id?: string
          question_id?: string | null
          survey_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "survey_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_answers_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "wellbeing_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_questions: {
        Row: {
          created_at: string
          id: string
          options: Json | null
          position: number
          question: Json
          question_type: string
          survey_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          options?: Json | null
          position?: number
          question?: Json
          question_type?: string
          survey_id: string
        }
        Update: {
          created_at?: string
          id?: string
          options?: Json | null
          position?: number
          question?: Json
          question_type?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "wellbeing_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      wellbeing_index_scores: {
        Row: {
          category_scores: Json | null
          created_at: string
          id: string
          organization_id: string | null
          recorded_at: string
          score: number
          survey_id: string | null
          user_id: string
        }
        Insert: {
          category_scores?: Json | null
          created_at?: string
          id?: string
          organization_id?: string | null
          recorded_at?: string
          score: number
          survey_id?: string | null
          user_id: string
        }
        Update: {
          category_scores?: Json | null
          created_at?: string
          id?: string
          organization_id?: string | null
          recorded_at?: string
          score?: number
          survey_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellbeing_index_scores_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wellbeing_index_scores_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "wellbeing_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      wellbeing_surveys: {
        Row: {
          created_at: string
          created_by: string | null
          description: Json
          end_date: string | null
          id: string
          organization_id: string | null
          start_date: string | null
          status: string
          title: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: Json
          end_date?: string | null
          id?: string
          organization_id?: string | null
          start_date?: string | null
          status?: string
          title?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: Json
          end_date?: string | null
          id?: string
          organization_id?: string | null
          start_date?: string | null
          status?: string
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellbeing_surveys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_org_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
