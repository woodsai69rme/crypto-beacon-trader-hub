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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          project_id: string | null
          resource_id: string
          resource_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          project_id?: string | null
          resource_id: string
          resource_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          project_id?: string | null
          resource_id?: string
          resource_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_models: {
        Row: {
          api_endpoint: string | null
          api_key_encrypted: string | null
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          model_id: string
          name: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          model_id: string
          name: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          model_id?: string
          name?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          created_at: string | null
          id: string
          is_applied: boolean | null
          original_content: string | null
          reason: string | null
          resume_id: string
          section_type: string
          suggested_content: string
          suggestion_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_applied?: boolean | null
          original_content?: string | null
          reason?: string | null
          resume_id: string
          section_type: string
          suggested_content: string
          suggestion_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_applied?: boolean | null
          original_content?: string | null
          reason?: string | null
          resume_id?: string
          section_type?: string
          suggested_content?: string
          suggestion_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tools: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_custom: boolean | null
          logo: string | null
          name: string
          reset_time: string
          updated_at: string | null
          usage_count: number
          usage_limit: number
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_custom?: boolean | null
          logo?: string | null
          name: string
          reset_time: string
          updated_at?: string | null
          usage_count?: number
          usage_limit?: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_custom?: boolean | null
          logo?: string | null
          name?: string
          reset_time?: string
          updated_at?: string | null
          usage_count?: number
          usage_limit?: number
          user_id?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          asset_id: string | null
          condition: Json
          created_at: string
          expires_at: string | null
          id: string
          notes: string | null
          notification_channels: string[] | null
          recurring: boolean | null
          status: string
          symbol: string | null
          triggered_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          asset_id?: string | null
          condition: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          notification_channels?: string[] | null
          recurring?: boolean | null
          status?: string
          symbol?: string | null
          triggered_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          asset_id?: string | null
          condition?: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          notification_channels?: string[] | null
          recurring?: boolean | null
          status?: string
          symbol?: string | null
          triggered_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          last_used: string | null
          name: string
          permissions: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          last_used?: string | null
          name: string
          permissions?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          last_used?: string | null
          name?: string
          permissions?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      automations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          last_run: string | null
          name: string
          project_id: string | null
          run_count: number | null
          trigger_config: Json | null
          trigger_type: string
          updated_at: string
          user_id: string
          webhook_url: string | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          name: string
          project_id?: string | null
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          name?: string
          project_id?: string | null
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
          timestamp: string
        }
        Insert: {
          content: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context: string | null
          created_at: string
          id: string
          metadata: Json | null
          model: string
          project_id: string | null
          starred: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          model: string
          project_id?: string | null
          starred?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          model?: string
          project_id?: string | null
          starred?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contents: {
        Row: {
          content: Json
          created_at: string
          file_path: string | null
          file_type: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          size: number | null
          source: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          file_path?: string | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          size?: number | null
          source: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          file_path?: string | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          size?: number | null
          source?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_type: string
          id: string
          metadata: Json | null
          project_id: string | null
          size: number | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_type: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          size?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_type?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          size?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exchange_connections: {
        Row: {
          api_key_encrypted: string | null
          api_secret_encrypted: string | null
          created_at: string | null
          exchange_name: string
          id: string
          is_active: boolean | null
          last_sync: string | null
          passphrase_encrypted: string | null
          permissions: Json | null
          sandbox_mode: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          created_at?: string | null
          exchange_name: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          passphrase_encrypted?: string | null
          permissions?: Json | null
          sandbox_mode?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          created_at?: string | null
          exchange_name?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          passphrase_encrypted?: string | null
          permissions?: Json | null
          sandbox_mode?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          assets: Json | null
          category: string
          code: string | null
          config: Json | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assets?: Json | null
          category: string
          code?: string | null
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assets?: Json | null
          category?: string
          code?: string | null
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          project_id: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      market_data: {
        Row: {
          change_24h: number
          id: string
          last_updated: string
          market_cap: number
          name: string
          price: number
          symbol: string
          user_id: string | null
          volume_24h: number
        }
        Insert: {
          change_24h: number
          id?: string
          last_updated?: string
          market_cap: number
          name: string
          price: number
          symbol: string
          user_id?: string | null
          volume_24h: number
        }
        Update: {
          change_24h?: number
          id?: string
          last_updated?: string
          market_cap?: number
          name?: string
          price?: number
          symbol?: string
          user_id?: string | null
          volume_24h?: number
        }
        Relationships: []
      }
      market_data_cache: {
        Row: {
          ask: number | null
          bid: number | null
          change_24h: number | null
          exchange: string
          id: string
          price: number
          symbol: string
          timestamp: string | null
          volume_24h: number | null
        }
        Insert: {
          ask?: number | null
          bid?: number | null
          change_24h?: number | null
          exchange: string
          id?: string
          price: number
          symbol: string
          timestamp?: string | null
          volume_24h?: number | null
        }
        Update: {
          ask?: number | null
          bid?: number | null
          change_24h?: number | null
          exchange?: string
          id?: string
          price?: number
          symbol?: string
          timestamp?: string | null
          volume_24h?: number | null
        }
        Relationships: []
      }
      news_analysis: {
        Row: {
          created_at: string
          id: string
          published_at: string
          sentiment: string | null
          sentiment_score: number | null
          source: string
          summary: string | null
          title: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          published_at: string
          sentiment?: string | null
          sentiment_score?: number | null
          source: string
          summary?: string | null
          title: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          published_at?: string
          sentiment?: string | null
          sentiment_score?: number | null
          source?: string
          summary?: string | null
          title?: string
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          average_price: number | null
          bot_id: string | null
          created_at: string | null
          exchange: string
          exchange_order_id: string | null
          execution_strategy: Json | null
          fees: number | null
          filled_amount: number | null
          id: string
          order_type: string
          price: number | null
          side: string
          status: string | null
          stop_price: number | null
          symbol: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          average_price?: number | null
          bot_id?: string | null
          created_at?: string | null
          exchange: string
          exchange_order_id?: string | null
          execution_strategy?: Json | null
          fees?: number | null
          filled_amount?: number | null
          id?: string
          order_type: string
          price?: number | null
          side: string
          status?: string | null
          stop_price?: number | null
          symbol: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          average_price?: number | null
          bot_id?: string | null
          created_at?: string | null
          exchange?: string
          exchange_order_id?: string | null
          execution_strategy?: Json | null
          fees?: number | null
          filled_amount?: number | null
          id?: string
          order_type?: string
          price?: number | null
          side?: string
          status?: string | null
          stop_price?: number | null
          symbol?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          daily_return: number | null
          entity_id: string
          entity_type: string
          id: string
          max_drawdown: number | null
          metric_date: string
          profit_factor: number | null
          sharpe_ratio: number | null
          total_return: number | null
          volatility: number | null
          win_rate: number | null
        }
        Insert: {
          created_at?: string | null
          daily_return?: number | null
          entity_id: string
          entity_type: string
          id?: string
          max_drawdown?: number | null
          metric_date: string
          profit_factor?: number | null
          sharpe_ratio?: number | null
          total_return?: number | null
          volatility?: number | null
          win_rate?: number | null
        }
        Update: {
          created_at?: string | null
          daily_return?: number | null
          entity_id?: string
          entity_type?: string
          id?: string
          max_drawdown?: number | null
          metric_date?: string
          profit_factor?: number | null
          sharpe_ratio?: number | null
          total_return?: number | null
          volatility?: number | null
          win_rate?: number | null
        }
        Relationships: []
      }
      platform_connections: {
        Row: {
          access_token: string | null
          access_token_secret: string | null
          api_key: string | null
          api_secret: string | null
          connected: boolean | null
          id: string
          last_updated: string | null
          platform: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_secret?: string | null
          api_key?: string | null
          api_secret?: string | null
          connected?: boolean | null
          id?: string
          last_updated?: string | null
          platform: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_secret?: string | null
          api_key?: string | null
          api_secret?: string | null
          connected?: boolean | null
          id?: string
          last_updated?: string | null
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string | null
          id: string
          name: string
          positions: Json | null
          profit_percentage: number | null
          total_profit: number | null
          total_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          positions?: Json | null
          profit_percentage?: number | null
          total_profit?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          positions?: Json | null
          profit_percentage?: number | null
          total_profit?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_shares: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_public: boolean | null
          permission_level: string
          project_id: string
          share_token: string | null
          shared_by: string
          shared_with: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          permission_level?: string
          project_id: string
          share_token?: string | null
          shared_by: string
          shared_with?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          permission_level?: string
          project_id?: string
          share_token?: string | null
          shared_by?: string
          shared_with?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_shares_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          model: string | null
          project_id: string | null
          starred: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          model?: string | null
          project_id?: string | null
          starred?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          model?: string | null
          project_id?: string | null
          starred?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      resume_analytics: {
        Row: {
          created_at: string | null
          downloads_count: number | null
          id: string
          last_viewed: string | null
          resume_id: string
          shares_count: number | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          created_at?: string | null
          downloads_count?: number | null
          id?: string
          last_viewed?: string | null
          resume_id: string
          shares_count?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          created_at?: string | null
          downloads_count?: number | null
          id?: string
          last_viewed?: string | null
          resume_id?: string
          shares_count?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_analytics_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          design_config: Json
          id: string
          is_premium: boolean | null
          name: string
          preview_url: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          design_config?: Json
          id?: string
          is_premium?: boolean | null
          name: string
          preview_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          design_config?: Json
          id?: string
          is_premium?: boolean | null
          name?: string
          preview_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          ats_score: number | null
          certifications: Json
          created_at: string | null
          custom_sections: Json
          design_settings: Json
          education: Json
          experience: Json
          id: string
          is_public: boolean | null
          languages: Json
          personal_info: Json
          projects: Json
          share_token: string | null
          skills: Json
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          certifications?: Json
          created_at?: string | null
          custom_sections?: Json
          design_settings?: Json
          education?: Json
          experience?: Json
          id?: string
          is_public?: boolean | null
          languages?: Json
          personal_info?: Json
          projects?: Json
          share_token?: string | null
          skills?: Json
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ats_score?: number | null
          certifications?: Json
          created_at?: string | null
          custom_sections?: Json
          design_settings?: Json
          education?: Json
          experience?: Json
          id?: string
          is_public?: boolean | null
          languages?: Json
          personal_info?: Json
          projects?: Json
          share_token?: string | null
          skills?: Json
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "resume_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_jobs: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string
          error_message: string | null
          id: string
          name: string
          project_id: string | null
          results: Json | null
          scraping_type: string
          started_at: string | null
          status: string
          urls: string[]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          name: string
          project_id?: string | null
          results?: Json | null
          scraping_type: string
          started_at?: string | null
          status?: string
          urls: string[]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          name?: string
          project_id?: string | null
          results?: Json | null
          scraping_type?: string
          started_at?: string | null
          status?: string
          urls?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraping_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_follows: {
        Row: {
          allocation_percentage: number | null
          created_at: string | null
          follower_id: string
          id: string
          is_active: boolean | null
          max_allocation: number | null
          strategy_id: string
        }
        Insert: {
          allocation_percentage?: number | null
          created_at?: string | null
          follower_id: string
          id?: string
          is_active?: boolean | null
          max_allocation?: number | null
          strategy_id: string
        }
        Update: {
          allocation_percentage?: number | null
          created_at?: string | null
          follower_id?: string
          id?: string
          is_active?: boolean | null
          max_allocation?: number | null
          strategy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_follows_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategy_shares"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_shares: {
        Row: {
          config: Json
          created_at: string | null
          creator_id: string
          description: string | null
          followers_count: number | null
          id: string
          is_public: boolean | null
          name: string
          performance_metrics: Json | null
          price: number | null
          rating: number | null
          strategy_type: string
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          creator_id: string
          description?: string | null
          followers_count?: number | null
          id?: string
          is_public?: boolean | null
          name: string
          performance_metrics?: Json | null
          price?: number | null
          rating?: number | null
          strategy_type: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          creator_id?: string
          description?: string | null
          followers_count?: number | null
          id?: string
          is_public?: boolean | null
          name?: string
          performance_metrics?: Json | null
          price?: number | null
          rating?: number | null
          strategy_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trading_bots: {
        Row: {
          active_since: string
          ai_model: string | null
          alerts: Json | null
          config: Json | null
          created_at: string
          current_value: number | null
          id: string
          initial_investment: number | null
          last_trade: Json | null
          name: string
          performance: Json
          risk_level: string | null
          status: string
          strategy: string
          target_asset: string | null
          total_trades: number | null
          underperforming: boolean | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          active_since?: string
          ai_model?: string | null
          alerts?: Json | null
          config?: Json | null
          created_at?: string
          current_value?: number | null
          id?: string
          initial_investment?: number | null
          last_trade?: Json | null
          name: string
          performance?: Json
          risk_level?: string | null
          status?: string
          strategy: string
          target_asset?: string | null
          total_trades?: number | null
          underperforming?: boolean | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          active_since?: string
          ai_model?: string | null
          alerts?: Json | null
          config?: Json | null
          created_at?: string
          current_value?: number | null
          id?: string
          initial_investment?: number | null
          last_trade?: Json | null
          name?: string
          performance?: Json
          risk_level?: string | null
          status?: string
          strategy?: string
          target_asset?: string | null
          total_trades?: number | null
          underperforming?: boolean | null
          user_id?: string
          win_rate?: number | null
        }
        Relationships: []
      }
      trading_signals: {
        Row: {
          confidence: number
          created_at: string
          details: Json | null
          execution_status: string
          id: string
          price: number
          symbol: string
          type: string
          user_id: string
        }
        Insert: {
          confidence: number
          created_at?: string
          details?: Json | null
          execution_status?: string
          id?: string
          price: number
          symbol: string
          type: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          details?: Json | null
          execution_status?: string
          id?: string
          price?: number
          symbol?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          permissions: Json | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          setting_name: string
          setting_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_name: string
          setting_value?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_name?: string
          setting_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          assets: string[] | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assets?: string[] | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assets?: string[] | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          active: boolean | null
          created_at: string | null
          events: string[]
          id: string
          name: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          events: string[]
          id?: string
          name: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          events?: string[]
          id?: string
          name?: string
          updated_at?: string | null
          url?: string
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
      user_role: "admin" | "trader" | "viewer" | "api_only"
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
      user_role: ["admin", "trader", "viewer", "api_only"],
    },
  },
} as const
