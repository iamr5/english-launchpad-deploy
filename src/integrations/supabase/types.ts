export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      circle_members: {
        Row: {
          id: string;
          circle_id: string;
          nickname: string;
          color: string;
          is_bot: boolean;
          token: string;
          persona: string | null;
          last_seen_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          nickname: string;
          color?: string;
          is_bot?: boolean;
          token: string;
          persona?: string | null;
          last_seen_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          nickname?: string;
          color?: string;
          is_bot?: boolean;
          token?: string;
          persona?: string | null;
          last_seen_at?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "circle_members_circle_id_fkey"; columns: ["circle_id"]; isOneToOne: false; referencedRelation: "circles"; referencedColumns: ["id"]; },
        ];
      };
      circle_messages: {
        Row: {
          id: string;
          circle_id: string;
          member_id: string;
          task_idx: number;
          kind: string;
          body: string;
          audio_path: string | null;
          duration_ms: number;
          reply_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          member_id: string;
          task_idx?: number;
          kind?: string;
          body?: string;
          audio_path?: string | null;
          duration_ms?: number;
          reply_to?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          member_id?: string;
          task_idx?: number;
          kind?: string;
          body?: string;
          audio_path?: string | null;
          duration_ms?: number;
          reply_to?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "circle_messages_circle_id_fkey"; columns: ["circle_id"]; isOneToOne: false; referencedRelation: "circles"; referencedColumns: ["id"]; },
          { foreignKeyName: "circle_messages_member_id_fkey"; columns: ["member_id"]; isOneToOne: false; referencedRelation: "circle_members"; referencedColumns: ["id"]; },
          { foreignKeyName: "circle_messages_reply_to_fkey"; columns: ["reply_to"]; isOneToOne: false; referencedRelation: "circle_messages"; referencedColumns: ["id"]; },
        ];
      };
      circle_tasks: {
        Row: {
          id: string;
          circle_id: string;
          idx: number;
          prompt_en: string;
          prompt_es: string;
          model_en: string;
          functions: unknown;
          audio_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          idx: number;
          prompt_en: string;
          prompt_es?: string;
          model_en?: string;
          functions?: unknown;
          audio_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          idx?: number;
          prompt_en?: string;
          prompt_es?: string;
          model_en?: string;
          functions?: unknown;
          audio_path?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "circle_tasks_circle_id_fkey"; columns: ["circle_id"]; isOneToOne: false; referencedRelation: "circles"; referencedColumns: ["id"]; },
        ];
      };
      circles: {
        Row: {
          id: string;
          code: string;
          level: string;
          topic: string;
          bots_enabled: boolean;
          task_idx: number;
          task_started_at: string;
          bot_busy_until: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          level?: string;
          topic?: string;
          bots_enabled?: boolean;
          task_idx?: number;
          task_started_at?: string;
          bot_busy_until?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          level?: string;
          topic?: string;
          bots_enabled?: boolean;
          task_idx?: number;
          task_started_at?: string;
          bot_busy_until?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      demos: {
        Row: {
          slug: string;
          institution: string;
          config: Json;
          published: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          institution: string;
          config?: Json;
          published?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          institution?: string;
          config?: Json;
          published?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          id: string;
          guardian_id: string;
          student_id: string;
          kind: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          guardian_id: string;
          student_id: string;
          kind: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          guardian_id?: string;
          student_id?: string;
          kind?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "links_guardian_id_fkey"; columns: ["guardian_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"]; },
          { foreignKeyName: "links_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"]; },
        ];
      };
      mascot_library: {
        Row: {
          id: string;
          name: string;
          short_name: string | null;
          kind: string | null;
          emoji: string | null;
          base_url: string;
          manifest: Json;
          thumb: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name?: string | null;
          kind?: string | null;
          emoji?: string | null;
          base_url: string;
          manifest?: Json;
          thumb?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string | null;
          kind?: string | null;
          emoji?: string | null;
          base_url?: string;
          manifest?: Json;
          thumb?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      org_domains: {
        Row: {
          match: string;
          org_id: string;
          created_at: string;
          role: unknown | null;
        };
        Insert: {
          match: string;
          org_id: string;
          created_at?: string;
          role?: unknown | null;
        };
        Update: {
          match?: string;
          org_id?: string;
          created_at?: string;
          role?: unknown | null;
        };
        Relationships: [
          { foreignKeyName: "org_domains_org_id_fkey"; columns: ["org_id"]; isOneToOne: false; referencedRelation: "orgs"; referencedColumns: ["id"]; },
        ];
      };
      org_invites: {
        Row: {
          code: string;
          org_id: string;
          max_uses: number;
          uses: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          org_id: string;
          max_uses?: number;
          uses?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          code?: string;
          org_id?: string;
          max_uses?: number;
          uses?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "org_invites_org_id_fkey"; columns: ["org_id"]; isOneToOne: false; referencedRelation: "orgs"; referencedColumns: ["id"]; },
        ];
      };
      org_members: {
        Row: {
          user_id: string;
          org_id: string;
          source: string;
          joined_at: string;
        };
        Insert: {
          user_id: string;
          org_id: string;
          source?: string;
          joined_at?: string;
        };
        Update: {
          user_id?: string;
          org_id?: string;
          source?: string;
          joined_at?: string;
        };
        Relationships: [
          { foreignKeyName: "org_members_org_id_fkey"; columns: ["org_id"]; isOneToOne: false; referencedRelation: "orgs"; referencedColumns: ["id"]; },
          { foreignKeyName: "org_members_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"]; },
        ];
      };
      orgs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand_slug: string | null;
          config: Json;
          active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand_slug?: string | null;
          config?: Json;
          active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand_slug?: string | null;
          config?: Json;
          active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "orgs_brand_slug_fkey"; columns: ["brand_slug"]; isOneToOne: false; referencedRelation: "demos"; referencedColumns: ["slug"]; },
        ];
      };
      preinscripciones: {
        Row: {
          id: string;
          email: string;
          slug: string;
          utm: Json;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          slug?: string;
          utm?: Json;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          slug?: string;
          utm?: Json;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          role: unknown;
          level: number;
          daily_goal: number;
          created_at: string;
          org_id: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          role?: unknown;
          level?: number;
          daily_goal?: number;
          created_at?: string;
          org_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          role?: unknown;
          level?: number;
          daily_goal?: number;
          created_at?: string;
          org_id?: string | null;
        };
        Relationships: [
          { foreignKeyName: "profiles_id_fkey"; columns: ["id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"]; },
          { foreignKeyName: "profiles_org_id_fkey"; columns: ["org_id"]; isOneToOne: false; referencedRelation: "orgs"; referencedColumns: ["id"]; },
        ];
      };
      progress: {
        Row: {
          user_id: string;
          xp: number;
          level: number;
          streak_days: Json;
          lessons: Json;
          skill_errors: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          xp?: number;
          level?: number;
          streak_days?: Json;
          lessons?: Json;
          skill_errors?: Json;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          xp?: number;
          level?: number;
          streak_days?: Json;
          lessons?: Json;
          skill_errors?: Json;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "progress_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"]; },
        ];
      };
      speaking_attempts: {
        Row: {
          id: string;
          user_id: string;
          demo_slug: string;
          exercise_id: string;
          level: string;
          mode: string;
          attempt_number: number;
          duration_ms: number;
          audio_path: string | null;
          audio_expires_at: string | null;
          local_transcript: string;
          ai_transcript: string;
          local_score: number | null;
          pronunciation_score: number | null;
          fluency_score: number | null;
          grammar_score: number | null;
          passed: boolean;
          problem_words: Json;
          word_differences: Json;
          feedback: Json;
          local_latency_ms: number | null;
          ai_latency_ms: number | null;
          audio_bytes: number | null;
          usage: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          demo_slug: string;
          exercise_id: string;
          level: string;
          mode: string;
          attempt_number: number;
          duration_ms?: number;
          audio_path?: string | null;
          audio_expires_at?: string | null;
          local_transcript?: string;
          ai_transcript?: string;
          local_score?: number | null;
          pronunciation_score?: number | null;
          fluency_score?: number | null;
          grammar_score?: number | null;
          passed?: boolean;
          problem_words?: Json;
          word_differences?: Json;
          feedback?: Json;
          local_latency_ms?: number | null;
          ai_latency_ms?: number | null;
          audio_bytes?: number | null;
          usage?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          demo_slug?: string;
          exercise_id?: string;
          level?: string;
          mode?: string;
          attempt_number?: number;
          duration_ms?: number;
          audio_path?: string | null;
          audio_expires_at?: string | null;
          local_transcript?: string;
          ai_transcript?: string;
          local_score?: number | null;
          pronunciation_score?: number | null;
          fluency_score?: number | null;
          grammar_score?: number | null;
          passed?: boolean;
          problem_words?: Json;
          word_differences?: Json;
          feedback?: Json;
          local_latency_ms?: number | null;
          ai_latency_ms?: number | null;
          audio_bytes?: number | null;
          usage?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "speaking_attempts_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"]; },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: unknown;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: unknown;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: unknown;
        };
        Relationships: [
          { foreignKeyName: "user_roles_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"]; },
        ];
      };
    };
    Views: {
    };
    Functions: {
      apply_roster_role: {
        Args: {
          _user: string;
          arg: unknown;
        };
        Returns: unknown;
      };
      assign_org_on_signup: {
        Args: {
        };
        Returns: unknown;
      };
      handle_new_user: {
        Args: {
        };
        Returns: unknown;
      };
      has_role: {
        Args: {
          _user_id: string;
          arg: unknown;
        };
        Returns: boolean;
      };
      is_guardian_of: {
        Args: {
          _guardian: string;
          arg: unknown;
        };
        Returns: boolean;
      };
      my_org_id: {
        Args: {
        };
        Returns: string;
      };
      org_for_email: {
        Args: {
          _email: string;
        };
        Returns: string;
      };
      org_role_for_email: {
        Args: {
          _email: string;
        };
        Returns: unknown;
      };
      redeem_org_invite: {
        Args: {
          _code: string;
        };
        Returns: string;
      };
      resync_org_members: {
        Args: {
        };
        Returns: number;
      };
      set_speaking_attempt_updated_at: {
        Args: {
        };
        Returns: unknown;
      };
      touch_demos_updated_at: {
        Args: {
        };
        Returns: unknown;
      };
      touch_orgs_updated_at: {
        Args: {
        };
        Returns: unknown;
      };
    };
    Enums: {
      app_role: "student" | "parent" | "teacher" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  auth: {
    Tables: {
      audit_log_entries: {
        Row: {
          instance_id: string | null;
          id: string;
          payload: Json | null;
          created_at: string | null;
          ip_address: string;
        };
        Insert: {
          instance_id?: string | null;
          id: string;
          payload?: Json | null;
          created_at?: string | null;
          ip_address?: string;
        };
        Update: {
          instance_id?: string | null;
          id?: string;
          payload?: Json | null;
          created_at?: string | null;
          ip_address?: string;
        };
        Relationships: [];
      };
      flow_state: {
        Row: {
          id: string;
          user_id: string | null;
          auth_code: string | null;
          code_challenge_method: unknown | null;
          code_challenge: string | null;
          provider_type: string;
          provider_access_token: string | null;
          provider_refresh_token: string | null;
          created_at: string | null;
          updated_at: string | null;
          authentication_method: string;
          auth_code_issued_at: string | null;
          invite_token: string | null;
          referrer: string | null;
          oauth_client_state_id: string | null;
          linking_target_id: string | null;
          email_optional: boolean;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          auth_code?: string | null;
          code_challenge_method?: unknown | null;
          code_challenge?: string | null;
          provider_type: string;
          provider_access_token?: string | null;
          provider_refresh_token?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          authentication_method: string;
          auth_code_issued_at?: string | null;
          invite_token?: string | null;
          referrer?: string | null;
          oauth_client_state_id?: string | null;
          linking_target_id?: string | null;
          email_optional?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          auth_code?: string | null;
          code_challenge_method?: unknown | null;
          code_challenge?: string | null;
          provider_type?: string;
          provider_access_token?: string | null;
          provider_refresh_token?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          authentication_method?: string;
          auth_code_issued_at?: string | null;
          invite_token?: string | null;
          referrer?: string | null;
          oauth_client_state_id?: string | null;
          linking_target_id?: string | null;
          email_optional?: boolean;
        };
        Relationships: [];
      };
      identities: {
        Row: {
          provider_id: string;
          user_id: string;
          identity_data: Json;
          provider: string;
          last_sign_in_at: string | null;
          created_at: string | null;
          updated_at: string | null;
          email: string | null;
          id: string;
        };
        Insert: {
          provider_id: string;
          user_id: string;
          identity_data: Json;
          provider: string;
          last_sign_in_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          email?: string | null;
          id?: string;
        };
        Update: {
          provider_id?: string;
          user_id?: string;
          identity_data?: Json;
          provider?: string;
          last_sign_in_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          email?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      instances: {
        Row: {
          id: string;
          uuid: string | null;
          raw_base_config: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          uuid?: string | null;
          raw_base_config?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          uuid?: string | null;
          raw_base_config?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      mfa_amr_claims: {
        Row: {
          session_id: string;
          created_at: string;
          updated_at: string;
          authentication_method: string;
          id: string;
        };
        Insert: {
          session_id: string;
          created_at: string;
          updated_at: string;
          authentication_method: string;
          id: string;
        };
        Update: {
          session_id?: string;
          created_at?: string;
          updated_at?: string;
          authentication_method?: string;
          id?: string;
        };
        Relationships: [];
      };
      mfa_challenges: {
        Row: {
          id: string;
          factor_id: string;
          created_at: string;
          verified_at: string | null;
          ip_address: unknown;
          otp_code: string | null;
          web_authn_session_data: Json | null;
        };
        Insert: {
          id: string;
          factor_id: string;
          created_at: string;
          verified_at?: string | null;
          ip_address: unknown;
          otp_code?: string | null;
          web_authn_session_data?: Json | null;
        };
        Update: {
          id?: string;
          factor_id?: string;
          created_at?: string;
          verified_at?: string | null;
          ip_address?: unknown;
          otp_code?: string | null;
          web_authn_session_data?: Json | null;
        };
        Relationships: [];
      };
      mfa_factors: {
        Row: {
          id: string;
          user_id: string;
          friendly_name: string | null;
          factor_type: unknown;
          status: unknown;
          created_at: string;
          updated_at: string;
          secret: string | null;
          phone: string | null;
          last_challenged_at: string | null;
          web_authn_credential: Json | null;
          web_authn_aaguid: string | null;
          last_webauthn_challenge_data: Json | null;
        };
        Insert: {
          id: string;
          user_id: string;
          friendly_name?: string | null;
          factor_type: unknown;
          status: unknown;
          created_at: string;
          updated_at: string;
          secret?: string | null;
          phone?: string | null;
          last_challenged_at?: string | null;
          web_authn_credential?: Json | null;
          web_authn_aaguid?: string | null;
          last_webauthn_challenge_data?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          friendly_name?: string | null;
          factor_type?: unknown;
          status?: unknown;
          created_at?: string;
          updated_at?: string;
          secret?: string | null;
          phone?: string | null;
          last_challenged_at?: string | null;
          web_authn_credential?: Json | null;
          web_authn_aaguid?: string | null;
          last_webauthn_challenge_data?: Json | null;
        };
        Relationships: [];
      };
      one_time_tokens: {
        Row: {
          id: string;
          user_id: string;
          token_type: unknown;
          token_hash: string;
          relates_to: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          token_type: unknown;
          token_hash: string;
          relates_to: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token_type?: unknown;
          token_hash?: string;
          relates_to?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      refresh_tokens: {
        Row: {
          instance_id: string | null;
          id: number;
          token: string | null;
          user_id: string | null;
          revoked: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          parent: string | null;
          session_id: string | null;
        };
        Insert: {
          instance_id?: string | null;
          id?: number;
          token?: string | null;
          user_id?: string | null;
          revoked?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          parent?: string | null;
          session_id?: string | null;
        };
        Update: {
          instance_id?: string | null;
          id?: number;
          token?: string | null;
          user_id?: string | null;
          revoked?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          parent?: string | null;
          session_id?: string | null;
        };
        Relationships: [];
      };
      saml_providers: {
        Row: {
          id: string;
          sso_provider_id: string;
          entity_id: string;
          metadata_xml: string;
          metadata_url: string | null;
          attribute_mapping: Json | null;
          created_at: string | null;
          updated_at: string | null;
          name_id_format: string | null;
        };
        Insert: {
          id: string;
          sso_provider_id: string;
          entity_id: string;
          metadata_xml: string;
          metadata_url?: string | null;
          attribute_mapping?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          name_id_format?: string | null;
        };
        Update: {
          id?: string;
          sso_provider_id?: string;
          entity_id?: string;
          metadata_xml?: string;
          metadata_url?: string | null;
          attribute_mapping?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          name_id_format?: string | null;
        };
        Relationships: [];
      };
      saml_relay_states: {
        Row: {
          id: string;
          sso_provider_id: string;
          request_id: string;
          for_email: string | null;
          redirect_to: string | null;
          created_at: string | null;
          updated_at: string | null;
          flow_state_id: string | null;
        };
        Insert: {
          id: string;
          sso_provider_id: string;
          request_id: string;
          for_email?: string | null;
          redirect_to?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          flow_state_id?: string | null;
        };
        Update: {
          id?: string;
          sso_provider_id?: string;
          request_id?: string;
          for_email?: string | null;
          redirect_to?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          flow_state_id?: string | null;
        };
        Relationships: [];
      };
      schema_migrations: {
        Row: {
          version: string;
        };
        Insert: {
          version: string;
        };
        Update: {
          version?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
          factor_id: string | null;
          aal: unknown | null;
          not_after: string | null;
          refreshed_at: string | null;
          user_agent: string | null;
          ip: unknown | null;
          tag: string | null;
          oauth_client_id: string | null;
          refresh_token_hmac_key: string | null;
          refresh_token_counter: number | null;
          scopes: string | null;
        };
        Insert: {
          id: string;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
          factor_id?: string | null;
          aal?: unknown | null;
          not_after?: string | null;
          refreshed_at?: string | null;
          user_agent?: string | null;
          ip?: unknown | null;
          tag?: string | null;
          oauth_client_id?: string | null;
          refresh_token_hmac_key?: string | null;
          refresh_token_counter?: number | null;
          scopes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          factor_id?: string | null;
          aal?: unknown | null;
          not_after?: string | null;
          refreshed_at?: string | null;
          user_agent?: string | null;
          ip?: unknown | null;
          tag?: string | null;
          oauth_client_id?: string | null;
          refresh_token_hmac_key?: string | null;
          refresh_token_counter?: number | null;
          scopes?: string | null;
        };
        Relationships: [];
      };
      sso_domains: {
        Row: {
          id: string;
          sso_provider_id: string;
          domain: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          sso_provider_id: string;
          domain: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          sso_provider_id?: string;
          domain?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      sso_providers: {
        Row: {
          id: string;
          resource_id: string | null;
          created_at: string | null;
          updated_at: string | null;
          disabled: boolean | null;
        };
        Insert: {
          id: string;
          resource_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          disabled?: boolean | null;
        };
        Update: {
          id?: string;
          resource_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          disabled?: boolean | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          instance_id: string | null;
          id: string;
          aud: string | null;
          role: string | null;
          email: string | null;
          encrypted_password: string | null;
          email_confirmed_at: string | null;
          invited_at: string | null;
          confirmation_token: string | null;
          confirmation_sent_at: string | null;
          recovery_token: string | null;
          recovery_sent_at: string | null;
          email_change_token_new: string | null;
          email_change: string | null;
          email_change_sent_at: string | null;
          last_sign_in_at: string | null;
          raw_app_meta_data: Json | null;
          raw_user_meta_data: Json | null;
          is_super_admin: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          phone: string | null;
          phone_confirmed_at: string | null;
          phone_change: string | null;
          phone_change_token: string | null;
          phone_change_sent_at: string | null;
          confirmed_at: string | null;
          email_change_token_current: string | null;
          email_change_confirm_status: number | null;
          banned_until: string | null;
          reauthentication_token: string | null;
          reauthentication_sent_at: string | null;
          is_sso_user: boolean;
          deleted_at: string | null;
          is_anonymous: boolean;
        };
        Insert: {
          instance_id?: string | null;
          id: string;
          aud?: string | null;
          role?: string | null;
          email?: string | null;
          encrypted_password?: string | null;
          email_confirmed_at?: string | null;
          invited_at?: string | null;
          confirmation_token?: string | null;
          confirmation_sent_at?: string | null;
          recovery_token?: string | null;
          recovery_sent_at?: string | null;
          email_change_token_new?: string | null;
          email_change?: string | null;
          email_change_sent_at?: string | null;
          last_sign_in_at?: string | null;
          raw_app_meta_data?: Json | null;
          raw_user_meta_data?: Json | null;
          is_super_admin?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          phone?: string | null;
          phone_confirmed_at?: string | null;
          phone_change?: string | null;
          phone_change_token?: string | null;
          phone_change_sent_at?: string | null;
          confirmed_at?: string | null;
          email_change_token_current?: string | null;
          email_change_confirm_status?: number | null;
          banned_until?: string | null;
          reauthentication_token?: string | null;
          reauthentication_sent_at?: string | null;
          is_sso_user?: boolean;
          deleted_at?: string | null;
          is_anonymous?: boolean;
        };
        Update: {
          instance_id?: string | null;
          id?: string;
          aud?: string | null;
          role?: string | null;
          email?: string | null;
          encrypted_password?: string | null;
          email_confirmed_at?: string | null;
          invited_at?: string | null;
          confirmation_token?: string | null;
          confirmation_sent_at?: string | null;
          recovery_token?: string | null;
          recovery_sent_at?: string | null;
          email_change_token_new?: string | null;
          email_change?: string | null;
          email_change_sent_at?: string | null;
          last_sign_in_at?: string | null;
          raw_app_meta_data?: Json | null;
          raw_user_meta_data?: Json | null;
          is_super_admin?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          phone?: string | null;
          phone_confirmed_at?: string | null;
          phone_change?: string | null;
          phone_change_token?: string | null;
          phone_change_sent_at?: string | null;
          confirmed_at?: string | null;
          email_change_token_current?: string | null;
          email_change_confirm_status?: number | null;
          banned_until?: string | null;
          reauthentication_token?: string | null;
          reauthentication_sent_at?: string | null;
          is_sso_user?: boolean;
          deleted_at?: string | null;
          is_anonymous?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
    };
    Functions: {
      email: {
        Args: {
        };
        Returns: string;
      };
      jwt: {
        Args: {
        };
        Returns: Json;
      };
      role: {
        Args: {
        };
        Returns: string;
      };
      uid: {
        Args: {
        };
        Returns: string;
      };
    };
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3";
      code_challenge_method: "s256" | "plain";
      factor_status: "unverified" | "verified";
      factor_type: "totp" | "webauthn" | "phone";
      oauth_authorization_status: "pending" | "approved" | "denied" | "expired";
      oauth_client_type: "public" | "confidential";
      oauth_registration_type: "dynamic" | "manual";
      oauth_response_type: "code";
      one_time_token_type: "confirmation_token" | "reauthentication_token" | "recovery_token" | "email_change_token_new" | "email_change_token_current" | "phone_change_token";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
