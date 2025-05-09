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
      admin_operations_log: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          operation_type: string
          performed_by: string
          target_user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          operation_type: string
          performed_by: string
          target_user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          operation_type?: string
          performed_by?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
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
      assistance_centers: {
        Row: {
          address: string
          city: string
          coordinator_name: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          neighborhood: string
          phone: string | null
          state: string
          type: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          coordinator_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          neighborhood: string
          phone?: string | null
          state: string
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          coordinator_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          neighborhood?: string
          phone?: string | null
          state?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance_attachments: {
        Row: {
          attendance_id: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          attendance_id?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          attendance_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_attachments_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "social_attendances"
            referencedColumns: ["id"]
          },
        ]
      }
      benefit_attachments: {
        Row: {
          benefit_id: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          benefit_id?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          benefit_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "benefit_attachments_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "emergency_benefits"
            referencedColumns: ["id"]
          },
        ]
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
      education_classes: {
        Row: {
          classroom: string | null
          created_at: string
          current_students: number | null
          grade: string
          id: string
          is_active: boolean | null
          max_students: number
          name: string
          school_id: string
          shift: string
          updated_at: string
          year: number
        }
        Insert: {
          classroom?: string | null
          created_at?: string
          current_students?: number | null
          grade: string
          id?: string
          is_active?: boolean | null
          max_students: number
          name: string
          school_id: string
          shift: string
          updated_at?: string
          year: number
        }
        Update: {
          classroom?: string | null
          created_at?: string
          current_students?: number | null
          grade?: string
          id?: string
          is_active?: boolean | null
          max_students?: number
          name?: string
          school_id?: string
          shift?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "education_classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      education_enrollments: {
        Row: {
          assigned_school_id: string | null
          class_id: string | null
          created_at: string
          decision_by: string | null
          decision_date: string | null
          id: string
          justification: string | null
          notes: string | null
          protocol_number: string
          request_date: string
          requested_school_id: string
          school_year: number
          special_request: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          assigned_school_id?: string | null
          class_id?: string | null
          created_at?: string
          decision_by?: string | null
          decision_date?: string | null
          id?: string
          justification?: string | null
          notes?: string | null
          protocol_number: string
          request_date?: string
          requested_school_id: string
          school_year: number
          special_request?: string | null
          status: string
          student_id: string
          updated_at?: string
        }
        Update: {
          assigned_school_id?: string | null
          class_id?: string | null
          created_at?: string
          decision_by?: string | null
          decision_date?: string | null
          id?: string
          justification?: string | null
          notes?: string | null
          protocol_number?: string
          request_date?: string
          requested_school_id?: string
          school_year?: number
          special_request?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_enrollments_assigned_school_id_fkey"
            columns: ["assigned_school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "education_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_enrollments_requested_school_id_fkey"
            columns: ["requested_school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "education_students"
            referencedColumns: ["id"]
          },
        ]
      }
      education_grades: {
        Row: {
          absence_days: number | null
          attendance_days: number | null
          class_id: string
          comments: string | null
          created_at: string
          created_by: string
          grade: number | null
          id: string
          period: string
          school_year: number
          student_id: string
          subject: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          absence_days?: number | null
          attendance_days?: number | null
          class_id: string
          comments?: string | null
          created_at?: string
          created_by: string
          grade?: number | null
          id?: string
          period: string
          school_year: number
          student_id: string
          subject: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          absence_days?: number | null
          attendance_days?: number | null
          class_id?: string
          comments?: string | null
          created_at?: string
          created_by?: string
          grade?: number | null
          id?: string
          period?: string
          school_year?: number
          student_id?: string
          subject?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_grades_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "education_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "education_students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_grades_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "education_teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      education_meal_feedback: {
        Row: {
          class_id: string | null
          comments: string | null
          created_at: string
          feedback_date: string
          id: string
          meal_menu_id: string | null
          parent_id: string | null
          parent_name: string
          rating: string
          school_id: string
          student_name: string
        }
        Insert: {
          class_id?: string | null
          comments?: string | null
          created_at?: string
          feedback_date?: string
          id?: string
          meal_menu_id?: string | null
          parent_id?: string | null
          parent_name: string
          rating: string
          school_id: string
          student_name: string
        }
        Update: {
          class_id?: string | null
          comments?: string | null
          created_at?: string
          feedback_date?: string
          id?: string
          meal_menu_id?: string | null
          parent_id?: string | null
          parent_name?: string
          rating?: string
          school_id?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_meal_feedback_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "education_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_meal_feedback_meal_menu_id_fkey"
            columns: ["meal_menu_id"]
            isOneToOne: false
            referencedRelation: "education_meal_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_meal_feedback_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      education_meal_menus: {
        Row: {
          active_from: string
          active_until: string | null
          created_at: string
          created_by: string | null
          day_of_week: number
          for_dietary_restrictions: string[] | null
          id: string
          is_active: boolean | null
          is_special_diet: boolean | null
          menu_items: string[]
          month: number | null
          name: string
          nutritional_info: string | null
          school_id: string
          shift: string
          updated_at: string
          week_number: number | null
          year: number
        }
        Insert: {
          active_from: string
          active_until?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week: number
          for_dietary_restrictions?: string[] | null
          id?: string
          is_active?: boolean | null
          is_special_diet?: boolean | null
          menu_items: string[]
          month?: number | null
          name: string
          nutritional_info?: string | null
          school_id: string
          shift: string
          updated_at?: string
          week_number?: number | null
          year: number
        }
        Update: {
          active_from?: string
          active_until?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week?: number
          for_dietary_restrictions?: string[] | null
          id?: string
          is_active?: boolean | null
          is_special_diet?: boolean | null
          menu_items?: string[]
          month?: number | null
          name?: string
          nutritional_info?: string | null
          school_id?: string
          shift?: string
          updated_at?: string
          week_number?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "education_meal_menus_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
        ]
      }
      education_occurrence_attachments: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          occurrence_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          occurrence_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          occurrence_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_occurrence_attachments_occurrence_id_fkey"
            columns: ["occurrence_id"]
            isOneToOne: false
            referencedRelation: "education_occurrences"
            referencedColumns: ["id"]
          },
        ]
      }
      education_occurrences: {
        Row: {
          class_id: string | null
          created_at: string
          description: string
          id: string
          occurrence_date: string
          occurrence_type: string
          parent_notification_date: string | null
          parent_notified: boolean | null
          reported_by: string
          reported_by_name: string
          resolution: string | null
          resolution_date: string | null
          resolved_by: string | null
          school_id: string
          severity: string | null
          student_id: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          description: string
          id?: string
          occurrence_date: string
          occurrence_type: string
          parent_notification_date?: string | null
          parent_notified?: boolean | null
          reported_by: string
          reported_by_name: string
          resolution?: string | null
          resolution_date?: string | null
          resolved_by?: string | null
          school_id: string
          severity?: string | null
          student_id: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          description?: string
          id?: string
          occurrence_date?: string
          occurrence_type?: string
          parent_notification_date?: string | null
          parent_notified?: boolean | null
          reported_by?: string
          reported_by_name?: string
          resolution?: string | null
          resolution_date?: string | null
          resolved_by?: string | null
          school_id?: string
          severity?: string | null
          student_id?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_occurrences_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "education_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_occurrences_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_occurrences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "education_students"
            referencedColumns: ["id"]
          },
        ]
      }
      education_schools: {
        Row: {
          address: string
          city: string
          created_at: string
          current_students: number | null
          director_contact: string | null
          director_name: string | null
          email: string | null
          id: string
          inep_code: string
          is_active: boolean | null
          max_capacity: number
          name: string
          neighborhood: string
          pedagogical_coordinator: string | null
          phone: string | null
          shifts: string[]
          state: string
          type: string
          updated_at: string
          vice_director_contact: string | null
          vice_director_name: string | null
          zip_code: string | null
        }
        Insert: {
          address: string
          city?: string
          created_at?: string
          current_students?: number | null
          director_contact?: string | null
          director_name?: string | null
          email?: string | null
          id?: string
          inep_code: string
          is_active?: boolean | null
          max_capacity: number
          name: string
          neighborhood: string
          pedagogical_coordinator?: string | null
          phone?: string | null
          shifts: string[]
          state?: string
          type: string
          updated_at?: string
          vice_director_contact?: string | null
          vice_director_name?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          current_students?: number | null
          director_contact?: string | null
          director_name?: string | null
          email?: string | null
          id?: string
          inep_code?: string
          is_active?: boolean | null
          max_capacity?: number
          name?: string
          neighborhood?: string
          pedagogical_coordinator?: string | null
          phone?: string | null
          shifts?: string[]
          state?: string
          type?: string
          updated_at?: string
          vice_director_contact?: string | null
          vice_director_name?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      education_special_diets: {
        Row: {
          created_at: string
          diet_type: string
          end_date: string | null
          id: string
          is_active: boolean | null
          medical_documentation: boolean | null
          notes: string | null
          restrictions: string[]
          school_id: string
          start_date: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diet_type: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          medical_documentation?: boolean | null
          notes?: string | null
          restrictions: string[]
          school_id: string
          start_date: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diet_type?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          medical_documentation?: boolean | null
          notes?: string | null
          restrictions?: string[]
          school_id?: string
          start_date?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_special_diets_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_special_diets_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "education_students"
            referencedColumns: ["id"]
          },
        ]
      }
      education_student_transport: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          pickup_location: string
          return_location: string
          route_id: string
          school_id: string
          start_date: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          pickup_location: string
          return_location: string
          route_id: string
          school_id: string
          start_date: string
          status: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          pickup_location?: string
          return_location?: string
          route_id?: string
          school_id?: string
          start_date?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_student_transport_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "education_transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_student_transport_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_student_transport_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "education_students"
            referencedColumns: ["id"]
          },
        ]
      }
      education_students: {
        Row: {
          address: string
          birth_date: string
          city: string
          cpf: string | null
          created_at: string
          id: string
          is_active: boolean | null
          medical_info: string | null
          name: string
          neighborhood: string
          parent_cpf: string | null
          parent_email: string | null
          parent_id: string | null
          parent_name: string
          parent_phone: string
          registration_number: string
          special_needs: string | null
          state: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address: string
          birth_date: string
          city?: string
          cpf?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          medical_info?: string | null
          name: string
          neighborhood: string
          parent_cpf?: string | null
          parent_email?: string | null
          parent_id?: string | null
          parent_name: string
          parent_phone: string
          registration_number: string
          special_needs?: string | null
          state?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          birth_date?: string
          city?: string
          cpf?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          medical_info?: string | null
          name?: string
          neighborhood?: string
          parent_cpf?: string | null
          parent_email?: string | null
          parent_id?: string | null
          parent_name?: string
          parent_phone?: string
          registration_number?: string
          special_needs?: string | null
          state?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      education_teacher_classes: {
        Row: {
          class_id: string
          created_at: string
          id: string
          is_active: boolean | null
          subject: string
          teacher_id: string
          weekly_hours: number
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          subject: string
          teacher_id: string
          weekly_hours: number
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          subject?: string
          teacher_id?: string
          weekly_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "education_teacher_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "education_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_teacher_classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "education_teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      education_teacher_schools: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          school_id: string
          start_date: string
          teacher_id: string
          workload: number
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          school_id: string
          start_date: string
          teacher_id: string
          workload: number
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          school_id?: string
          start_date?: string
          teacher_id?: string
          workload?: number
        }
        Relationships: [
          {
            foreignKeyName: "education_teacher_schools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_teacher_schools_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "education_teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      education_teachers: {
        Row: {
          address: string
          birth_date: string
          cpf: string
          created_at: string
          education_level: string
          email: string
          hiring_date: string
          id: string
          is_active: boolean | null
          name: string
          phone: string
          registration_number: string
          specialties: string[] | null
          teaching_areas: string[]
          updated_at: string
        }
        Insert: {
          address: string
          birth_date: string
          cpf: string
          created_at?: string
          education_level: string
          email: string
          hiring_date: string
          id?: string
          is_active?: boolean | null
          name: string
          phone: string
          registration_number: string
          specialties?: string[] | null
          teaching_areas: string[]
          updated_at?: string
        }
        Update: {
          address?: string
          birth_date?: string
          cpf?: string
          created_at?: string
          education_level?: string
          email?: string
          hiring_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string
          registration_number?: string
          specialties?: string[] | null
          teaching_areas?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      education_transport_requests: {
        Row: {
          complaint_type: string | null
          created_at: string
          current_route_id: string | null
          description: string
          id: string
          pickup_location: string | null
          protocol_number: string
          request_type: string
          requested_route_id: string | null
          requester_contact: string
          requester_id: string | null
          requester_name: string
          resolution_date: string | null
          resolution_notes: string | null
          resolved_by: string | null
          return_location: string | null
          school_id: string | null
          status: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          complaint_type?: string | null
          created_at?: string
          current_route_id?: string | null
          description: string
          id?: string
          pickup_location?: string | null
          protocol_number: string
          request_type: string
          requested_route_id?: string | null
          requester_contact: string
          requester_id?: string | null
          requester_name: string
          resolution_date?: string | null
          resolution_notes?: string | null
          resolved_by?: string | null
          return_location?: string | null
          school_id?: string | null
          status: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          complaint_type?: string | null
          created_at?: string
          current_route_id?: string | null
          description?: string
          id?: string
          pickup_location?: string | null
          protocol_number?: string
          request_type?: string
          requested_route_id?: string | null
          requester_contact?: string
          requester_id?: string | null
          requester_name?: string
          resolution_date?: string | null
          resolution_notes?: string | null
          resolved_by?: string | null
          return_location?: string | null
          school_id?: string | null
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_transport_requests_current_route_id_fkey"
            columns: ["current_route_id"]
            isOneToOne: false
            referencedRelation: "education_transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_transport_requests_requested_route_id_fkey"
            columns: ["requested_route_id"]
            isOneToOne: false
            referencedRelation: "education_transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_transport_requests_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "education_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_transport_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "education_students"
            referencedColumns: ["id"]
          },
        ]
      }
      education_transport_routes: {
        Row: {
          average_duration: number | null
          created_at: string
          current_students: number | null
          departure_time: string
          destination: string
          distance: number | null
          id: string
          is_active: boolean | null
          max_capacity: number
          name: string
          origin: string
          return_time: string
          school_ids: string[]
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          average_duration?: number | null
          created_at?: string
          current_students?: number | null
          departure_time: string
          destination: string
          distance?: number | null
          id?: string
          is_active?: boolean | null
          max_capacity: number
          name: string
          origin: string
          return_time: string
          school_ids: string[]
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          average_duration?: number | null
          created_at?: string
          current_students?: number | null
          departure_time?: string
          destination?: string
          distance?: number | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number
          name?: string
          origin?: string
          return_time?: string
          school_ids?: string[]
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_transport_routes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "education_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      education_vehicles: {
        Row: {
          capacity: number
          created_at: string
          driver_contact: string
          driver_license: string
          driver_name: string
          id: string
          is_accessible: boolean | null
          is_active: boolean | null
          model: string
          monitor_contact: string | null
          monitor_name: string | null
          plate: string
          type: string
          updated_at: string
          year: number
        }
        Insert: {
          capacity: number
          created_at?: string
          driver_contact: string
          driver_license: string
          driver_name: string
          id?: string
          is_accessible?: boolean | null
          is_active?: boolean | null
          model: string
          monitor_contact?: string | null
          monitor_name?: string | null
          plate: string
          type: string
          updated_at?: string
          year: number
        }
        Update: {
          capacity?: number
          created_at?: string
          driver_contact?: string
          driver_license?: string
          driver_name?: string
          id?: string
          is_accessible?: boolean | null
          is_active?: boolean | null
          model?: string
          monitor_contact?: string | null
          monitor_name?: string | null
          plate?: string
          type?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      emergency_benefits: {
        Row: {
          benefit_type: string
          citizen_id: string | null
          comments: string | null
          created_at: string | null
          delivery_date: string | null
          id: string
          protocol_number: string
          reason: string
          receiver_signature: string | null
          request_date: string | null
          responsible_id: string | null
          status: Database["public"]["Enums"]["benefit_status"] | null
          updated_at: string | null
        }
        Insert: {
          benefit_type: string
          citizen_id?: string | null
          comments?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          protocol_number: string
          reason: string
          receiver_signature?: string | null
          request_date?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["benefit_status"] | null
          updated_at?: string | null
        }
        Update: {
          benefit_type?: string
          citizen_id?: string | null
          comments?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          protocol_number?: string
          reason?: string
          receiver_signature?: string | null
          request_date?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["benefit_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_benefits_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizen_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_benefits_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          citizen_id: string | null
          created_at: string | null
          family_id: string | null
          id: string
          is_dependent: boolean | null
          relationship: string
          updated_at: string | null
        }
        Insert: {
          citizen_id?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          is_dependent?: boolean | null
          relationship: string
          updated_at?: string | null
        }
        Update: {
          citizen_id?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          is_dependent?: boolean | null
          relationship?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizen_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "vulnerable_families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_monitoring_plans: {
        Row: {
          actions: string[]
          contact_frequency: string
          created_at: string | null
          end_date: string | null
          family_id: string | null
          id: string
          objectives: string
          responsible_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actions: string[]
          contact_frequency: string
          created_at?: string | null
          end_date?: string | null
          family_id?: string | null
          id?: string
          objectives: string
          responsible_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actions?: string[]
          contact_frequency?: string
          created_at?: string | null
          end_date?: string | null
          family_id?: string | null
          id?: string
          objectives?: string
          responsible_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_monitoring_plans_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "vulnerable_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_monitoring_plans_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_visits: {
        Row: {
          created_at: string | null
          evolution: string | null
          family_id: string | null
          id: string
          next_visit_date: string | null
          observations: string
          professional_id: string | null
          situation: string
          updated_at: string | null
          visit_date: string | null
        }
        Insert: {
          created_at?: string | null
          evolution?: string | null
          family_id?: string | null
          id?: string
          next_visit_date?: string | null
          observations: string
          professional_id?: string | null
          situation: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Update: {
          created_at?: string | null
          evolution?: string | null
          family_id?: string | null
          id?: string
          next_visit_date?: string | null
          observations?: string
          professional_id?: string | null
          situation?: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_visits_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "vulnerable_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_visits_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      hr_attendances: {
        Row: {
          attendance_date: string
          attended_by: string
          created_at: string
          description: string
          employee_id: string
          id: string
          notes: string | null
          service_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attendance_date?: string
          attended_by: string
          created_at?: string
          description: string
          employee_id: string
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attendance_date?: string
          attended_by?: string
          created_at?: string
          description?: string
          employee_id?: string
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_attendances_attended_by_fkey"
            columns: ["attended_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_attendances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_attendances_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "hr_services"
            referencedColumns: ["id"]
          },
        ]
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
      hr_services: {
        Row: {
          approval_flow: Json | null
          available_for: string[] | null
          category: string
          created_at: string
          description: string | null
          form_schema: Json | null
          id: string
          is_active: boolean
          name: string
          requires_approval: boolean
          updated_at: string
        }
        Insert: {
          approval_flow?: Json | null
          available_for?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          form_schema?: Json | null
          id?: string
          is_active?: boolean
          name: string
          requires_approval?: boolean
          updated_at?: string
        }
        Update: {
          approval_flow?: Json | null
          available_for?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          form_schema?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          requires_approval?: boolean
          updated_at?: string
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
          document_category: string
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
          document_category?: string
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
          document_category?: string
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
      mail_internal_attachments: {
        Row: {
          document_id: string | null
          file_name: string
          file_path: string | null
          file_size: number
          file_type: string
          id: string
          message_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          document_id?: string | null
          file_name: string
          file_path?: string | null
          file_size: number
          file_type: string
          id?: string
          message_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          document_id?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_internal_attachments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "mail_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mail_internal_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "mail_internal_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_internal_messages: {
        Row: {
          content: string
          created_at: string
          from_department: string
          id: string
          read_at: string | null
          sent_at: string
          sent_by: string
          status: string
          subject: string
          to_department: string
        }
        Insert: {
          content: string
          created_at?: string
          from_department: string
          id?: string
          read_at?: string | null
          sent_at?: string
          sent_by: string
          status?: string
          subject: string
          to_department: string
        }
        Update: {
          content?: string
          created_at?: string
          from_department?: string
          id?: string
          read_at?: string | null
          sent_at?: string
          sent_by?: string
          status?: string
          subject?: string
          to_department?: string
        }
        Relationships: []
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
          footer: string | null
          header: string | null
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
          footer?: string | null
          header?: string | null
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
          footer?: string | null
          header?: string | null
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
      program_beneficiaries: {
        Row: {
          citizen_id: string | null
          created_at: string | null
          entry_date: string
          exit_date: string | null
          id: string
          is_active: boolean | null
          last_update_date: string | null
          nis_number: string | null
          program_id: string | null
          updated_at: string | null
        }
        Insert: {
          citizen_id?: string | null
          created_at?: string | null
          entry_date?: string
          exit_date?: string | null
          id?: string
          is_active?: boolean | null
          last_update_date?: string | null
          nis_number?: string | null
          program_id?: string | null
          updated_at?: string | null
        }
        Update: {
          citizen_id?: string | null
          created_at?: string | null
          entry_date?: string
          exit_date?: string | null
          id?: string
          is_active?: boolean | null
          last_update_date?: string | null
          nis_number?: string | null
          program_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_beneficiaries_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizen_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_beneficiaries_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "social_programs"
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
      request_attachments: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          request_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          request_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          request_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "unified_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_comments: {
        Row: {
          author_id: string
          author_type: string
          comment_text: string
          created_at: string
          id: string
          is_internal: boolean
          request_id: string
        }
        Insert: {
          author_id: string
          author_type: string
          comment_text: string
          created_at?: string
          id?: string
          is_internal?: boolean
          request_id: string
        }
        Update: {
          author_id?: string
          author_type?: string
          comment_text?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_comments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "unified_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_status_history: {
        Row: {
          changed_by: string
          comments: string | null
          created_at: string
          id: string
          new_status: string
          previous_status: string
          request_id: string
        }
        Insert: {
          changed_by: string
          comments?: string | null
          created_at?: string
          id?: string
          new_status: string
          previous_status: string
          request_id: string
        }
        Update: {
          changed_by?: string
          comments?: string | null
          created_at?: string
          id?: string
          new_status?: string
          previous_status?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "unified_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      social_attendances: {
        Row: {
          attendance_date: string | null
          attendance_type: Database["public"]["Enums"]["attendance_type"]
          center_id: string | null
          citizen_id: string | null
          created_at: string | null
          description: string
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          professional_id: string | null
          protocol_number: string
          referrals: string | null
          updated_at: string | null
        }
        Insert: {
          attendance_date?: string | null
          attendance_type: Database["public"]["Enums"]["attendance_type"]
          center_id?: string | null
          citizen_id?: string | null
          created_at?: string | null
          description: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          professional_id?: string | null
          protocol_number: string
          referrals?: string | null
          updated_at?: string | null
        }
        Update: {
          attendance_date?: string | null
          attendance_type?: Database["public"]["Enums"]["attendance_type"]
          center_id?: string | null
          citizen_id?: string | null
          created_at?: string | null
          description?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          professional_id?: string | null
          protocol_number?: string
          referrals?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_attendances_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "assistance_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_attendances_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizen_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_attendances_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_programs: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          scope: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          scope: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          scope?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      tfd_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          referral_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          referral_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          referral_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "tfd_documents_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "tfd_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      tfd_referrals: {
        Row: {
          created_at: string
          destination_city: string
          estimated_wait_time: number | null
          id: string
          observations: string | null
          patient_cpf: string | null
          patient_id: string
          patient_name: string
          priority: string
          protocol_number: string
          referral_reason: string
          referred_at: string
          referred_by: string
          scheduled_date: string | null
          specialty: string
          status: string
          transport_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_city: string
          estimated_wait_time?: number | null
          id?: string
          observations?: string | null
          patient_cpf?: string | null
          patient_id: string
          patient_name: string
          priority: string
          protocol_number: string
          referral_reason: string
          referred_at?: string
          referred_by: string
          scheduled_date?: string | null
          specialty: string
          status?: string
          transport_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_city?: string
          estimated_wait_time?: number | null
          id?: string
          observations?: string | null
          patient_cpf?: string | null
          patient_id?: string
          patient_name?: string
          priority?: string
          protocol_number?: string
          referral_reason?: string
          referred_at?: string
          referred_by?: string
          scheduled_date?: string | null
          specialty?: string
          status?: string
          transport_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tfd_transports: {
        Row: {
          capacity: number
          created_at: string
          departure_date: string
          departure_time: string
          driver_id: string
          driver_name: string
          id: string
          notes: string | null
          occupied_seats: number
          return_date: string | null
          return_time: string | null
          updated_at: string
          vehicle_description: string
          vehicle_id: string
        }
        Insert: {
          capacity: number
          created_at?: string
          departure_date: string
          departure_time: string
          driver_id: string
          driver_name: string
          id?: string
          notes?: string | null
          occupied_seats?: number
          return_date?: string | null
          return_time?: string | null
          updated_at?: string
          vehicle_description: string
          vehicle_id: string
        }
        Update: {
          capacity?: number
          created_at?: string
          departure_date?: string
          departure_time?: string
          driver_id?: string
          driver_name?: string
          id?: string
          notes?: string | null
          occupied_seats?: number
          return_date?: string | null
          return_time?: string | null
          updated_at?: string
          vehicle_description?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      unified_requests: {
        Row: {
          citizen_id: string | null
          completed_at: string | null
          created_at: string
          description: string
          due_date: string | null
          id: string
          original_request_id: string | null
          previous_department: string | null
          priority: string
          protocol_number: string
          requester_id: string
          requester_type: string
          status: string
          target_department: string
          title: string
          updated_at: string
        }
        Insert: {
          citizen_id?: string | null
          completed_at?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          original_request_id?: string | null
          previous_department?: string | null
          priority?: string
          protocol_number: string
          requester_id: string
          requester_type: string
          status?: string
          target_department: string
          title: string
          updated_at?: string
        }
        Update: {
          citizen_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          original_request_id?: string | null
          previous_department?: string | null
          priority?: string
          protocol_number?: string
          requester_id?: string
          requester_type?: string
          status?: string
          target_department?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unified_requests_original_request_id_fkey"
            columns: ["original_request_id"]
            isOneToOne: false
            referencedRelation: "unified_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_attachments: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string | null
          uploaded_by: string
          visit_id: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string | null
          uploaded_by: string
          visit_id?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visit_attachments_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "family_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      vulnerable_families: {
        Row: {
          address: string
          city: string
          created_at: string | null
          family_name: string
          family_status: Database["public"]["Enums"]["family_status"] | null
          id: string
          neighborhood: string
          reference_person_id: string | null
          responsible_id: string | null
          state: string
          updated_at: string | null
          vulnerability_criteria: Database["public"]["Enums"]["vulnerability_criteria"][]
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          family_name: string
          family_status?: Database["public"]["Enums"]["family_status"] | null
          id?: string
          neighborhood: string
          reference_person_id?: string | null
          responsible_id?: string | null
          state: string
          updated_at?: string | null
          vulnerability_criteria: Database["public"]["Enums"]["vulnerability_criteria"][]
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          family_name?: string
          family_status?: Database["public"]["Enums"]["family_status"] | null
          id?: string
          neighborhood?: string
          reference_person_id?: string | null
          responsible_id?: string | null
          state?: string
          updated_at?: string | null
          vulnerability_criteria?: Database["public"]["Enums"]["vulnerability_criteria"][]
        }
        Relationships: [
          {
            foreignKeyName: "vulnerable_families_reference_person_id_fkey"
            columns: ["reference_person_id"]
            isOneToOne: false
            referencedRelation: "citizen_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vulnerable_families_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_class_students: {
        Args: { class_id: string }
        Returns: number
      }
      calculate_school_students: {
        Args: { school_id: string }
        Returns: number
      }
      generate_attendance_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_benefit_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_enrollment_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
      generate_tfd_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_transport_request_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unified_request_protocol: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_prefeito: {
        Args: { user_id: string }
        Returns: boolean
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
      attendance_type:
        | "reception"
        | "qualified_listening"
        | "referral"
        | "guidance"
        | "follow_up"
        | "other"
      benefit_status:
        | "pending"
        | "approved"
        | "delivering"
        | "completed"
        | "rejected"
      family_status:
        | "monitoring"
        | "stable"
        | "critical"
        | "improved"
        | "completed"
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
      vulnerability_criteria:
        | "income"
        | "housing"
        | "education"
        | "domestic_violence"
        | "health"
        | "unemployment"
        | "food_insecurity"
        | "other"
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
      attendance_type: [
        "reception",
        "qualified_listening",
        "referral",
        "guidance",
        "follow_up",
        "other",
      ],
      benefit_status: [
        "pending",
        "approved",
        "delivering",
        "completed",
        "rejected",
      ],
      family_status: [
        "monitoring",
        "stable",
        "critical",
        "improved",
        "completed",
      ],
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
      vulnerability_criteria: [
        "income",
        "housing",
        "education",
        "domestic_violence",
        "health",
        "unemployment",
        "food_insecurity",
        "other",
      ],
    },
  },
} as const
