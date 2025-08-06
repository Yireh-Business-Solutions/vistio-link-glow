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
      cards: {
        Row: {
          address: string | null
          awards: string | null
          bio: string | null
          certifications: string | null
          color_theme: string | null
          company: string | null
          company_logo: string | null
          company_logo_url: string | null
          created_at: string
          email: string | null
          id: string
          image_1_url: string | null
          image_2_url: string | null
          image_3_url: string | null
          image_4_url: string | null
          image_5_url: string | null
          instagram_url: string | null
          is_primary: boolean | null
          link_1_title: string | null
          link_1_url: string | null
          link_10_title: string | null
          link_10_url: string | null
          link_11_title: string | null
          link_11_url: string | null
          link_12_title: string | null
          link_12_url: string | null
          link_13_title: string | null
          link_13_url: string | null
          link_14_title: string | null
          link_14_url: string | null
          link_15_title: string | null
          link_15_url: string | null
          link_16_title: string | null
          link_16_url: string | null
          link_17_title: string | null
          link_17_url: string | null
          link_18_title: string | null
          link_18_url: string | null
          link_19_title: string | null
          link_19_url: string | null
          link_2_title: string | null
          link_2_url: string | null
          link_20_title: string | null
          link_20_url: string | null
          link_3_title: string | null
          link_3_url: string | null
          link_4_title: string | null
          link_4_url: string | null
          link_5_title: string | null
          link_5_url: string | null
          link_6_title: string | null
          link_6_url: string | null
          link_7_title: string | null
          link_7_url: string | null
          link_8_title: string | null
          link_8_url: string | null
          link_9_title: string | null
          link_9_url: string | null
          linkedin_url: string | null
          name: string
          org_id: string | null
          phone: string | null
          profile_image_url: string | null
          slug: string | null
          specialties: string | null
          title: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          view_count: number | null
          website: string | null
          whatsapp: string | null
          work_phone: string | null
        }
        Insert: {
          address?: string | null
          awards?: string | null
          bio?: string | null
          certifications?: string | null
          color_theme?: string | null
          company?: string | null
          company_logo?: string | null
          company_logo_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_1_url?: string | null
          image_2_url?: string | null
          image_3_url?: string | null
          image_4_url?: string | null
          image_5_url?: string | null
          instagram_url?: string | null
          is_primary?: boolean | null
          link_1_title?: string | null
          link_1_url?: string | null
          link_10_title?: string | null
          link_10_url?: string | null
          link_11_title?: string | null
          link_11_url?: string | null
          link_12_title?: string | null
          link_12_url?: string | null
          link_13_title?: string | null
          link_13_url?: string | null
          link_14_title?: string | null
          link_14_url?: string | null
          link_15_title?: string | null
          link_15_url?: string | null
          link_16_title?: string | null
          link_16_url?: string | null
          link_17_title?: string | null
          link_17_url?: string | null
          link_18_title?: string | null
          link_18_url?: string | null
          link_19_title?: string | null
          link_19_url?: string | null
          link_2_title?: string | null
          link_2_url?: string | null
          link_20_title?: string | null
          link_20_url?: string | null
          link_3_title?: string | null
          link_3_url?: string | null
          link_4_title?: string | null
          link_4_url?: string | null
          link_5_title?: string | null
          link_5_url?: string | null
          link_6_title?: string | null
          link_6_url?: string | null
          link_7_title?: string | null
          link_7_url?: string | null
          link_8_title?: string | null
          link_8_url?: string | null
          link_9_title?: string | null
          link_9_url?: string | null
          linkedin_url?: string | null
          name: string
          org_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          slug?: string | null
          specialties?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          view_count?: number | null
          website?: string | null
          whatsapp?: string | null
          work_phone?: string | null
        }
        Update: {
          address?: string | null
          awards?: string | null
          bio?: string | null
          certifications?: string | null
          color_theme?: string | null
          company?: string | null
          company_logo?: string | null
          company_logo_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_1_url?: string | null
          image_2_url?: string | null
          image_3_url?: string | null
          image_4_url?: string | null
          image_5_url?: string | null
          instagram_url?: string | null
          is_primary?: boolean | null
          link_1_title?: string | null
          link_1_url?: string | null
          link_10_title?: string | null
          link_10_url?: string | null
          link_11_title?: string | null
          link_11_url?: string | null
          link_12_title?: string | null
          link_12_url?: string | null
          link_13_title?: string | null
          link_13_url?: string | null
          link_14_title?: string | null
          link_14_url?: string | null
          link_15_title?: string | null
          link_15_url?: string | null
          link_16_title?: string | null
          link_16_url?: string | null
          link_17_title?: string | null
          link_17_url?: string | null
          link_18_title?: string | null
          link_18_url?: string | null
          link_19_title?: string | null
          link_19_url?: string | null
          link_2_title?: string | null
          link_2_url?: string | null
          link_20_title?: string | null
          link_20_url?: string | null
          link_3_title?: string | null
          link_3_url?: string | null
          link_4_title?: string | null
          link_4_url?: string | null
          link_5_title?: string | null
          link_5_url?: string | null
          link_6_title?: string | null
          link_6_url?: string | null
          link_7_title?: string | null
          link_7_url?: string | null
          link_8_title?: string | null
          link_8_url?: string | null
          link_9_title?: string | null
          link_9_url?: string | null
          linkedin_url?: string | null
          name?: string
          org_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          slug?: string | null
          specialties?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          view_count?: number | null
          website?: string | null
          whatsapp?: string | null
          work_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          card_id: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          source: string | null
        }
        Insert: {
          card_id: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          source?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      org_memberships: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_memberships_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          admin_user_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
