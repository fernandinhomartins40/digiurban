export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_permissions: {
        Row: {
          admin_id: string
          create_permission: boolean
          created_at: string
          delete_permission: boolean
          id: string
          module_id: string
          read_permission: boolean
          update_permission: boolean
          updated_at: string
        }
        Insert: {
          admin_id: string
          create_permission?: boolean
          created_at?: string
          delete_permission?: boolean
          id?: string
          module_id: string
          read_permission?: boolean
          update_permission?: boolean
          updated_at?: string
        }
        Update: {
          admin_id?: string
          create_permission?: boolean
          created_at?: string
          delete_permission?: boolean
          id?: string
          module_id?: string
          read_permission?: boolean
          update_permission?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_permissions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          id: string
          name: string
          position: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          id: string
          name: string
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          name?: string
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      citizen_profiles: {
        Row: {
          city: string | null
          cpf: string | null
          created_at: string
          email: string
          id: string
          name: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          state: string | null
          street: string | null
          updated_at: string
          zipcode: string | null
        }
        Insert: {
          city?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Update: {
          city?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      mail_document_attachments: {
        Row: {
          document_id: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          document_id: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          document_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_document_attachments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "mail_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_document_destinations: {
        Row: {
          document_id: string
          from_department: string
          id: string
          read_at: string | null
          received_at: string | null
          response_text: string | null
          sent_at: string
          sent_by: string
          status: Database["public"]["Enums"]["mail_document_status"]
          to_department: string
        }
        Insert: {
          document_id: string
          from_department: string
          id?: string
          read_at?: string | null
          received_at?: string | null
          response_text?: string | null
          sent_at?: string
          sent_by: string
          status?: Database["public"]["Enums"]["mail_document_status"]
          to_department: string
        }
        Update: {
          document_id?: string
          from_department?: string
          id?: string
          read_at?: string | null
          received_at?: string | null
          response_text?: string | null
          sent_at?: string
          sent_by?: string
          status?: Database["public"]["Enums"]["mail_document_status"]
          to_department?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_document_destinations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "mail_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_document_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      mail_documents: {
        Row: {
          content: string
          created_at: string
          creator_id: string
          department: string
          document_type_id: string
          id: string
          protocol_number: string
          status: Database["public"]["Enums"]["mail_document_status"]
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          creator_id: string
          department: string
          document_type_id: string
          id?: string
          protocol_number: string
          status?: Database["public"]["Enums"]["mail_document_status"]
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string
          department?: string
          document_type_id?: string
          id?: string
          protocol_number?: string
          status?: Database["public"]["Enums"]["mail_document_status"]
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "mail_document_types"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_template_fields: {
        Row: {
          created_at: string
          field_key: string
          field_label: string
          field_options: Json | null
          field_type: string
          id: string
          is_required: boolean
          order_position: number
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_label: string
          field_options?: Json | null
          field_type: string
          id?: string
          is_required?: boolean
          order_position?: number
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_label?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_required?: boolean
          order_position?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_template_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "mail_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_templates: {
        Row: {
          content: string
          created_at: string
          creator_id: string
          departments: string[]
          description: string | null
          document_type_id: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          creator_id: string
          departments: string[]
          description?: string | null
          document_type_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          creator_id?: string
          departments?: string[]
          description?: string | null
          document_type_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_templates_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "mail_document_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_protocol_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_has_permission: {
        Args: {
          module_id: string
          action: Database["public"]["Enums"]["permission_action"]
        }
        Returns: boolean
      }
    }
    Enums: {
      mail_document_status: "pending" | "forwarded" | "responded" | "completed"
      permission_action: "create" | "read" | "update" | "delete"
      user_role: "prefeito" | "admin" | "citizen"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mail_document_status: ["pending", "forwarded", "responded", "completed"],
      permission_action: ["create", "read", "update", "delete"],
      user_role: ["prefeito", "admin", "citizen"],
    },
  },
} as const
