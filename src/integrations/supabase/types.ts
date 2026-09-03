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
      budget_items: {
        Row: {
          actual: number
          category: string
          created_at: string
          estimated: number
          id: string
          label: string
          paid: boolean
          user_id: string
        }
        Insert: {
          actual?: number
          category: string
          created_at?: string
          estimated?: number
          id?: string
          label: string
          paid?: boolean
          user_id: string
        }
        Update: {
          actual?: number
          category?: string
          created_at?: string
          estimated?: number
          id?: string
          label?: string
          paid?: boolean
          user_id?: string
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          category: string
          created_at: string
          done: boolean
          due_date: string | null
          id: string
          sort_order: number
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          sort_order?: number
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          sort_order?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          email: string
          guest_count: number | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          supplier_id: string | null
          user_id: string | null
          venue_id: string | null
          wedding_date: string | null
        }
        Insert: {
          created_at?: string
          email: string
          guest_count?: number | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          supplier_id?: string | null
          user_id?: string | null
          venue_id?: string | null
          wedding_date?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          guest_count?: number | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          supplier_id?: string | null
          user_id?: string | null
          venue_id?: string | null
          wedding_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_list: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          party_size: number
          rsvp: string
          side: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          party_size?: number
          rsvp?: string
          side?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          party_size?: number
          rsvp?: string
          side?: string
          user_id?: string
        }
        Relationships: []
      }
      imported_reviews: {
        Row: {
          author_name: string | null
          body: string
          created_at: string
          id: string
          rating: number | null
          review_date: string | null
          source_name: string | null
          source_url: string | null
          supplier_id: string | null
          title: string | null
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          author_name?: string | null
          body: string
          created_at?: string
          id?: string
          rating?: number | null
          review_date?: string | null
          source_name?: string | null
          source_url?: string | null
          supplier_id?: string | null
          title?: string | null
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          author_name?: string | null
          body?: string
          created_at?: string
          id?: string
          rating?: number | null
          review_date?: string | null
          source_name?: string | null
          source_url?: string | null
          supplier_id?: string | null
          title?: string | null
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imported_reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imported_reviews_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          county: string | null
          created_at: string
          full_name: string | null
          id: string
          partner_name: string | null
          updated_at: string
          wedding_date: string | null
        }
        Insert: {
          avatar_url?: string | null
          county?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          partner_name?: string | null
          updated_at?: string
          wedding_date?: string | null
        }
        Update: {
          avatar_url?: string | null
          county?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          partner_name?: string | null
          updated_at?: string
          wedding_date?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          author_name: string
          body: string
          created_at: string
          id: string
          rating: number
          supplier_id: string | null
          title: string | null
          user_id: string
          venue_id: string | null
        }
        Insert: {
          approved?: boolean
          author_name: string
          body: string
          created_at?: string
          id?: string
          rating: number
          supplier_id?: string | null
          title?: string | null
          user_id: string
          venue_id?: string | null
        }
        Update: {
          approved?: boolean
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          rating?: number
          supplier_id?: string | null
          title?: string | null
          user_id?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          note: string | null
          supplier_id: string | null
          user_id: string
          venue_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          supplier_id?: string | null
          user_id: string
          venue_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          supplier_id?: string | null
          user_id?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_items_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          avg_price: string | null
          avg_price_num: number | null
          categories: string[]
          claimed_by: string | null
          county: string | null
          created_at: string
          description: string | null
          featured: boolean
          gallery_images: string[] | null
          id: string
          image_count: number | null
          latitude: number | null
          logo_image: string | null
          longitude: number | null
          name: string
          overview: string | null
          phone: string | null
          service_areas: string[] | null
          slug: string
          source_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          avg_price?: string | null
          avg_price_num?: number | null
          categories?: string[]
          claimed_by?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery_images?: string[] | null
          id?: string
          image_count?: number | null
          latitude?: number | null
          logo_image?: string | null
          longitude?: number | null
          name: string
          overview?: string | null
          phone?: string | null
          service_areas?: string[] | null
          slug: string
          source_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          avg_price?: string | null
          avg_price_num?: number | null
          categories?: string[]
          claimed_by?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery_images?: string[] | null
          id?: string
          image_count?: number | null
          latitude?: number | null
          logo_image?: string | null
          longitude?: number | null
          name?: string
          overview?: string | null
          phone?: string | null
          service_areas?: string[] | null
          slug?: string
          source_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string | null
          badge: string | null
          brochures: string[] | null
          capacity_max: number | null
          capacity_min: number | null
          claimed_by: string | null
          contact_person: string | null
          contact_role: string | null
          county: string | null
          created_at: string
          description: string | null
          facilities: string[] | null
          featured: boolean
          gallery_images: string[] | null
          guest_capacity: string | null
          id: string
          image_count: number | null
          latitude: number | null
          logo_image: string | null
          longitude: number | null
          name: string
          overview: string | null
          per_person_price: string | null
          per_person_price_num: number | null
          phone: string | null
          postcode: string | null
          rating: number | null
          real_weddings: string[] | null
          review_count: number | null
          slug: string
          source_url: string | null
          styles: string[] | null
          updated_at: string
          venue_hire_price: string | null
          venue_types: string[] | null
          website: string | null
        }
        Insert: {
          address?: string | null
          badge?: string | null
          brochures?: string[] | null
          capacity_max?: number | null
          capacity_min?: number | null
          claimed_by?: string | null
          contact_person?: string | null
          contact_role?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          featured?: boolean
          gallery_images?: string[] | null
          guest_capacity?: string | null
          id?: string
          image_count?: number | null
          latitude?: number | null
          logo_image?: string | null
          longitude?: number | null
          name: string
          overview?: string | null
          per_person_price?: string | null
          per_person_price_num?: number | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          real_weddings?: string[] | null
          review_count?: number | null
          slug: string
          source_url?: string | null
          styles?: string[] | null
          updated_at?: string
          venue_hire_price?: string | null
          venue_types?: string[] | null
          website?: string | null
        }
        Update: {
          address?: string | null
          badge?: string | null
          brochures?: string[] | null
          capacity_max?: number | null
          capacity_min?: number | null
          claimed_by?: string | null
          contact_person?: string | null
          contact_role?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          featured?: boolean
          gallery_images?: string[] | null
          guest_capacity?: string | null
          id?: string
          image_count?: number | null
          latitude?: number | null
          logo_image?: string | null
          longitude?: number | null
          name?: string
          overview?: string | null
          per_person_price?: string | null
          per_person_price_num?: number | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          real_weddings?: string[] | null
          review_count?: number | null
          slug?: string
          source_url?: string | null
          styles?: string[] | null
          updated_at?: string
          venue_hire_price?: string | null
          venue_types?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      wedding_fairs: {
        Row: {
          created_at: string
          date_text: string | null
          description: string | null
          email: string | null
          id: string
          image: string | null
          name: string
          phone: string | null
          slug: string
          source_url: string | null
          time_text: string | null
          venue_name: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          date_text?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image?: string | null
          name: string
          phone?: string | null
          slug: string
          source_url?: string | null
          time_text?: string | null
          venue_name?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          date_text?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image?: string | null
          name?: string
          phone?: string | null
          slug?: string
          source_url?: string | null
          time_text?: string | null
          venue_name?: string | null
          website?: string | null
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
    }
    Enums: {
      app_role: "couple" | "supplier" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["couple", "supplier", "admin"],
    },
  },
} as const
