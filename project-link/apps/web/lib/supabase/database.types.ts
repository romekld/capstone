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
      health_stations: {
        Row: {
          created_at: string
          facility_type: string
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          facility_type?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          facility_type?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          admin_notes: string | null
          alternate_mobile_number: string | null
          city_municipality: string | null
          coverage_notes: string | null
          created_at: string
          date_of_birth: string | null
          deactivation_reason: string | null
          email: string
          first_name: string
          health_station_id: string | null
          id: string
          last_login_at: string | null
          last_name: string
          middle_name: string | null
          mobile_number: string | null
          must_change_password: boolean
          name_suffix: string | null
          password_changed_at: string | null
          profile_photo_url: string | null
          province: string | null
          purok_assignment: string | null
          role: Database["public"]["Enums"]["user_role"]
          sex: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          admin_notes?: string | null
          alternate_mobile_number?: string | null
          city_municipality?: string | null
          coverage_notes?: string | null
          created_at?: string
          date_of_birth?: string | null
          deactivation_reason?: string | null
          email: string
          first_name: string
          health_station_id?: string | null
          id: string
          last_login_at?: string | null
          last_name: string
          middle_name?: string | null
          mobile_number?: string | null
          must_change_password?: boolean
          name_suffix?: string | null
          password_changed_at?: string | null
          profile_photo_url?: string | null
          province?: string | null
          purok_assignment?: string | null
          role: Database["public"]["Enums"]["user_role"]
          sex?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          admin_notes?: string | null
          alternate_mobile_number?: string | null
          city_municipality?: string | null
          coverage_notes?: string | null
          created_at?: string
          date_of_birth?: string | null
          deactivation_reason?: string | null
          email?: string
          first_name?: string
          health_station_id?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string
          middle_name?: string | null
          mobile_number?: string | null
          must_change_password?: boolean
          name_suffix?: string | null
          password_changed_at?: string | null
          profile_photo_url?: string | null
          province?: string | null
          purok_assignment?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sex?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_health_station_id_fkey"
            columns: ["health_station_id"]
            isOneToOne: false
            referencedRelation: "health_stations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "bhw" | "rhm" | "phn" | "phis" | "cho" | "system_admin"
      user_status: "active" | "inactive" | "invited" | "suspended"
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
      user_role: ["bhw", "rhm", "phn", "phis", "cho", "system_admin"],
      user_status: ["active", "inactive", "invited", "suspended"],
    },
  },
} as const
