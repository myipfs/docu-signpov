export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          is_site_wide: boolean
          message: string
          metadata: Json | null
          sender_id: string | null
          target_user_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          is_site_wide?: boolean
          message: string
          metadata?: Json | null
          sender_id?: string | null
          target_user_id?: string | null
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          is_site_wide?: boolean
          message?: string
          metadata?: Json | null
          sender_id?: string | null
          target_user_id?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          dormant_reason: string | null
          id: string
          is_dormant: boolean | null
          is_premium: boolean | null
          last_activity_at: string | null
          storage_limit: number
          storage_used: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dormant_reason?: string | null
          id: string
          is_dormant?: boolean | null
          is_premium?: boolean | null
          last_activity_at?: string | null
          storage_limit?: number
          storage_used?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dormant_reason?: string | null
          id?: string
          is_dormant?: boolean | null
          is_premium?: boolean | null
          last_activity_at?: string | null
          storage_limit?: number
          storage_used?: number
          updated_at?: string
        }
        Relationships: []
      }
      signatures: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          name: string | null
          signature_data: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          signature_data: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          signature_data?: string
          user_id?: string
        }
        Relationships: []
      }
      storage_history: {
        Row: {
          document_count: number | null
          id: number
          recorded_at: string | null
          signatures_count: number | null
          total_storage: number | null
          used_storage: number | null
          user_id: string | null
        }
        Insert: {
          document_count?: number | null
          id?: number
          recorded_at?: string | null
          signatures_count?: number | null
          total_storage?: number | null
          used_storage?: number | null
          user_id?: string | null
        }
        Update: {
          document_count?: number | null
          id?: number
          recorded_at?: string | null
          signatures_count?: number | null
          total_storage?: number | null
          used_storage?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      temporary_emails: {
        Row: {
          active: boolean | null
          created_at: string | null
          expires_at: string
          forwarding_to: string
          id: string
          temp_email: string
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          expires_at: string
          forwarding_to: string
          id?: string
          temp_email: string
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          expires_at?: string
          forwarding_to?: string
          id?: string
          temp_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_bulk_clear_storage: {
        Args: { p_user_ids: string[] }
        Returns: Json
      }
      admin_clear_user_storage: {
        Args: { p_user_id: string }
        Returns: Json
      }
      admin_delete_user_documents: {
        Args: { p_user_id: string; p_document_ids?: string[] }
        Returns: Json
      }
      admin_reactivate_user: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      get_admin_analytics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_admin_document_analytics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_admin_role: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      get_all_users_admin: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_and_track_storage: {
        Args: { user_id: string }
        Returns: {
          total_storage: number
          used_storage: number
          document_count: number
          signatures_count: number
        }[]
      }
      get_dormant_users: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_activity_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_storage_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_storage_data_v2: {
        Args: { user_id: string }
        Returns: {
          total_storage: number
          used_storage: number
          document_count: number
          signatures_count: number
          storage_buckets: string[]
        }[]
      }
      get_users_by_storage_threshold: {
        Args: { threshold_percentage?: number }
        Returns: Json
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      mark_dormant_users: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      send_notification: {
        Args: {
          p_title: string
          p_message: string
          p_type?: string
          p_is_site_wide?: boolean
          p_target_user_id?: string
          p_expires_at?: string
        }
        Returns: string
      }
      update_user_premium_status: {
        Args: { target_user_id: string; new_premium_status: boolean }
        Returns: boolean
      }
      update_user_storage: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
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
      admin_role: ["super_admin", "admin", "moderator"],
    },
  },
} as const
