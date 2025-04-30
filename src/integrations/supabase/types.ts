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
      health_program_activities: {
        Row: {
          actual_participants: number | null
          date: string
          description: string | null
          id: string
          location: string
          max_participants: number | null
          program_id: string
          responsible_id: string
          responsible_name: string
          status: string
          time: string
          title: string
        }
        Insert: {
          actual_participants?: number | null
          date: string
          description?: string | null
          id?: string
          location: string
          max_participants?: number | null
          program_id: string
          responsible_id: string
          responsible_name: string
          status?: string
          time: string
          title: string
        }
        Update: {
          actual_participants?: number | null
          date?: string
          description?: string | null
          id?: string
          location?: string
          max_participants?: number | null
          program_id?: string
          responsible_id?: string
          responsible_name?: string
          status?: string
          time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_program_activities_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "health_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      health_program_attendance: {
        Row: {
          activity_id: string
          attended: boolean
          id: string
          notes: string | null
          participant_id: string
        }
        Insert: {
          activity_id: string
          attended?: boolean
          id?: string
          notes?: string | null
          participant_id: string
        }
        Update: {
          activity_id?: string
          attended?: boolean
          id?: string
          notes?: string | null
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_program_attendance_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "health_program_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_program_attendance_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "health_program_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      health_program_participants: {
        Row: {
          exit_date: string | null
          id: string
          is_active: boolean
          join_date: string
          metrics: Json | null
          notes: string | null
          patient_id: string
          patient_name: string
          program_id: string
        }
        Insert: {
          exit_date?: string | null
          id?: string
          is_active?: boolean
          join_date?: string
          metrics?: Json | null
          notes?: string | null
          patient_id: string
          patient_name: string
          program_id: string
        }
        Update: {
          exit_date?: string | null
          id?: string
          is_active?: boolean
          join_date?: string
          metrics?: Json | null
          notes?: string | null
          patient_id?: string
          patient_name?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_program_participants_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "health_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      health_programs: {
        Row: {
          category: string
          coordinator_id: string
          coordinator_name: string
          created_at: string
          description: string
          end_date: string | null
          id: string
          is_active: boolean
          meeting_frequency: string | null
          name: string
          start_date: string
        }
        Insert: {
          category: string
          coordinator_id: string
          coordinator_name: string
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          meeting_frequency?: string | null
          name: string
          start_date: string
        }
        Update: {
          category?: string
          coordinator_id?: string
          coordinator_name?: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          meeting_frequency?: string | null
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      hr_document_types: {
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
      hr_documents: {
        Row: {
          created_at: string
          document_type_id: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          observations: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["hr_document_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type_id: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          observations?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["hr_document_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          observations?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["hr_document_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_documents_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "hr_document_types"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_request_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          request_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          request_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_request_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "hr_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_request_status_history: {
        Row: {
          changed_by: string
          comments: string | null
          created_at: string
          id: string
          request_id: string
          status: Database["public"]["Enums"]["hr_request_status"]
        }
        Insert: {
          changed_by: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id: string
          status: Database["public"]["Enums"]["hr_request_status"]
        }
        Update: {
          changed_by?: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id?: string
          status?: Database["public"]["Enums"]["hr_request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "hr_request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "hr_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_request_types: {
        Row: {
          created_at: string
          description: string | null
          form_schema: Json | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_schema?: Json | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          form_schema?: Json | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      hr_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          form_data: Json
          id: string
          protocol_number: string
          request_type_id: string
          status: Database["public"]["Enums"]["hr_request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          form_data: Json
          id?: string
          protocol_number: string
          request_type_id: string
          status?: Database["public"]["Enums"]["hr_request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          form_data?: Json
          id?: string
          protocol_number?: string
          request_type_id?: string
          status?: Database["public"]["Enums"]["hr_request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_requests_request_type_id_fkey"
            columns: ["request_type_id"]
            isOneToOne: false
            referencedRelation: "hr_request_types"
            referencedColumns: ["id"]
          },
        ]
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
      mayor_appointments: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          priority: string
          requested_date: string
          requested_time: string
          requester_email: string
          requester_id: string | null
          requester_name: string
          requester_phone: string | null
          responded_at: string | null
          responded_by: string | null
          response_message: string | null
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          priority?: string
          requested_date: string
          requested_time: string
          requester_email: string
          requester_id?: string | null
          requester_name: string
          requester_phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response_message?: string | null
          status?: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          priority?: string
          requested_date?: string
          requested_time?: string
          requester_email?: string
          requester_id?: string | null
          requester_name?: string
          requester_phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response_message?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mayor_dashboard_stats: {
        Row: {
          created_at: string | null
          id: string
          sector_id: string | null
          stat_date: string
          stat_target: number | null
          stat_type: string
          stat_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          sector_id?: string | null
          stat_date?: string
          stat_target?: number | null
          stat_type: string
          stat_value?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          sector_id?: string | null
          stat_date?: string
          stat_target?: number | null
          stat_type?: string
          stat_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      mayor_direct_requests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string
          due_date: string | null
          id: string
          priority: string
          protocol_number: string
          requester_id: string | null
          status: string
          target_department: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description: string
          due_date?: string | null
          id?: string
          priority?: string
          protocol_number: string
          requester_id?: string | null
          status?: string
          target_department: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          id?: string
          priority?: string
          protocol_number?: string
          requester_id?: string | null
          status?: string
          target_department?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mayor_office_audit_log: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          performed_by: string
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          performed_by: string
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          performed_by?: string
        }
        Relationships: []
      }
      mayor_request_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          request_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          request_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          request_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mayor_request_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mayor_direct_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      mayor_request_comments: {
        Row: {
          author_id: string
          comment_text: string
          created_at: string | null
          id: string
          request_id: string
        }
        Insert: {
          author_id: string
          comment_text: string
          created_at?: string | null
          id?: string
          request_id: string
        }
        Update: {
          author_id?: string
          comment_text?: string
          created_at?: string | null
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mayor_request_comments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mayor_direct_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      public_policies: {
        Row: {
          created_at: string | null
          created_by: string
          department: string
          description: string
          end_date: string | null
          id: string
          responsible_id: string
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          department: string
          description: string
          end_date?: string | null
          id?: string
          responsible_id: string
          start_date: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          department?: string
          description?: string
          end_date?: string | null
          id?: string
          responsible_id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      public_policy_goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          description: string
          due_date: string | null
          id: string
          policy_id: string
          status: string
          target_unit: string | null
          target_value: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          description: string
          due_date?: string | null
          id?: string
          policy_id: string
          status?: string
          target_unit?: string | null
          target_value?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          description?: string
          due_date?: string | null
          id?: string
          policy_id?: string
          status?: string
          target_unit?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_policy_goals_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "public_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          request_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          request_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          created_at: string
          description: string | null
          estimated_price: number | null
          id: string
          name: string
          quantity: number
          request_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_price?: number | null
          id?: string
          name: string
          quantity: number
          request_id: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_price?: number | null
          id?: string
          name?: string
          quantity?: number
          request_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          department: string
          id: string
          justification: string
          priority: Database["public"]["Enums"]["purchase_priority"]
          protocol_number: string
          status: Database["public"]["Enums"]["purchase_request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          department: string
          id?: string
          justification: string
          priority?: Database["public"]["Enums"]["purchase_priority"]
          protocol_number: string
          status?: Database["public"]["Enums"]["purchase_request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          department?: string
          id?: string
          justification?: string
          priority?: Database["public"]["Enums"]["purchase_priority"]
          protocol_number?: string
          status?: Database["public"]["Enums"]["purchase_request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchase_status_history: {
        Row: {
          changed_by: string
          comments: string | null
          created_at: string
          id: string
          request_id: string
          status: Database["public"]["Enums"]["purchase_request_status"]
        }
        Insert: {
          changed_by: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id: string
          status: Database["public"]["Enums"]["purchase_request_status"]
        }
        Update: {
          changed_by?: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id?: string
          status?: Database["public"]["Enums"]["purchase_request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "purchase_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_program_documents: {
        Row: {
          created_at: string | null
          document_description: string | null
          document_title: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          program_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          document_description?: string | null
          document_title: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          program_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          document_description?: string | null
          document_title?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          program_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_program_documents_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_program_milestones: {
        Row: {
          completion_date: string | null
          created_at: string | null
          description: string
          due_date: string
          id: string
          program_id: string
          responsible_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          program_id: string
          responsible_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          program_id?: string
          responsible_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategic_program_milestones_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_programs: {
        Row: {
          budget: number | null
          coordinator_id: string
          created_at: string | null
          created_by: string
          description: string
          end_date: string | null
          id: string
          progress_percentage: number | null
          spent_amount: number | null
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          coordinator_id: string
          created_at?: string | null
          created_by: string
          description: string
          end_date?: string | null
          id?: string
          progress_percentage?: number | null
          spent_amount?: number | null
          start_date: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          coordinator_id?: string
          created_at?: string | null
          created_by?: string
          description?: string
          end_date?: string | null
          id?: string
          progress_percentage?: number | null
          spent_amount?: number | null
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_hr_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_mayor_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_protocol_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_purchase_protocol: {
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
      hr_document_status: "pending" | "approved" | "rejected"
      hr_request_status: "pending" | "in_progress" | "approved" | "rejected"
      mail_document_status: "pending" | "forwarded" | "responded" | "completed"
      permission_action: "create" | "read" | "update" | "delete"
      purchase_priority: "low" | "normal" | "high" | "urgent"
      purchase_request_status:
        | "pending"
        | "in_analysis"
        | "approved"
        | "in_process"
        | "completed"
        | "rejected"
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
      hr_document_status: ["pending", "approved", "rejected"],
      hr_request_status: ["pending", "in_progress", "approved", "rejected"],
      mail_document_status: ["pending", "forwarded", "responded", "completed"],
      permission_action: ["create", "read", "update", "delete"],
      purchase_priority: ["low", "normal", "high", "urgent"],
      purchase_request_status: [
        "pending",
        "in_analysis",
        "approved",
        "in_process",
        "completed",
        "rejected",
      ],
      user_role: ["prefeito", "admin", "citizen"],
    },
  },
} as const
