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
      ai_agents: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          last_run: string | null
          model: string
          name: string
          run_count: number
          system_prompt: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_run?: string | null
          model: string
          name: string
          run_count?: number
          system_prompt: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          last_run?: string | null
          model?: string
          name?: string
          run_count?: number
          system_prompt?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          api_endpoint: string | null
          api_key_encrypted: string | null
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          model_id: string
          name: string
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_id: string
          name: string
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_id?: string
          name?: string
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_strategies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          indicators: string[] | null
          is_active: boolean | null
          market_data_sources: string[] | null
          model: string
          name: string
          parameters: Json
          prompt: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          indicators?: string[] | null
          is_active?: boolean | null
          market_data_sources?: string[] | null
          model?: string
          name: string
          parameters?: Json
          prompt: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          indicators?: string[] | null
          is_active?: boolean | null
          market_data_sources?: string[] | null
          model?: string
          name?: string
          parameters?: Json
          prompt?: string
          updated_at?: string | null
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
          condition_met: boolean | null
          created_at: string | null
          current_value: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          notification_sent: boolean | null
          symbol: string
          target_value: number
          triggered_at: string | null
          type: Database["public"]["Enums"]["alert_type"]
          user_id: string
        }
        Insert: {
          condition_met?: boolean | null
          created_at?: string | null
          current_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          symbol: string
          target_value: number
          triggered_at?: string | null
          type: Database["public"]["Enums"]["alert_type"]
          user_id: string
        }
        Update: {
          condition_met?: boolean | null
          created_at?: string | null
          current_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          symbol?: string
          target_value?: number
          triggered_at?: string | null
          type?: Database["public"]["Enums"]["alert_type"]
          user_id?: string
        }
        Relationships: []
      }
      analysis_results: {
        Row: {
          analysis_type: string
          content_ids: string[]
          created_at: string
          id: string
          metadata: Json
          project_id: string | null
          results: Json
          user_id: string | null
        }
        Insert: {
          analysis_type: string
          content_ids: string[]
          created_at?: string
          id?: string
          metadata?: Json
          project_id?: string | null
          results?: Json
          user_id?: string | null
        }
        Update: {
          analysis_type?: string
          content_ids?: string[]
          created_at?: string
          id?: string
          metadata?: Json
          project_id?: string | null
          results?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      backtest_results: {
        Row: {
          created_at: string | null
          end_date: string
          equity_curve: Json | null
          final_capital: number | null
          id: string
          initial_capital: number | null
          losing_trades: number | null
          max_drawdown: number | null
          parameters: Json | null
          profit_factor: number | null
          sharpe_ratio: number | null
          start_date: string
          strategy_id: string | null
          symbol: string
          timeframe: string
          total_return: number | null
          total_trades: number | null
          trades: Json | null
          user_id: string
          win_rate: number | null
          winning_trades: number | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          equity_curve?: Json | null
          final_capital?: number | null
          id?: string
          initial_capital?: number | null
          losing_trades?: number | null
          max_drawdown?: number | null
          parameters?: Json | null
          profit_factor?: number | null
          sharpe_ratio?: number | null
          start_date: string
          strategy_id?: string | null
          symbol: string
          timeframe?: string
          total_return?: number | null
          total_trades?: number | null
          trades?: Json | null
          user_id: string
          win_rate?: number | null
          winning_trades?: number | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          equity_curve?: Json | null
          final_capital?: number | null
          id?: string
          initial_capital?: number | null
          losing_trades?: number | null
          max_drawdown?: number | null
          parameters?: Json | null
          profit_factor?: number | null
          sharpe_ratio?: number | null
          start_date?: string
          strategy_id?: string | null
          symbol?: string
          timeframe?: string
          total_return?: number | null
          total_trades?: number | null
          trades?: Json | null
          user_id?: string
          win_rate?: number | null
          winning_trades?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "backtest_results_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "ai_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      blockchain_transactions: {
        Row: {
          amount: number
          block_number: number | null
          blockchain: string
          created_at: string | null
          from_address: string
          gas_fee: number | null
          id: string
          status: string | null
          timestamp: string
          to_address: string
          token_address: string | null
          token_symbol: string
          tx_hash: string
          tx_type: string
          user_id: string
        }
        Insert: {
          amount: number
          block_number?: number | null
          blockchain: string
          created_at?: string | null
          from_address: string
          gas_fee?: number | null
          id?: string
          status?: string | null
          timestamp: string
          to_address: string
          token_address?: string | null
          token_symbol: string
          tx_hash: string
          tx_type: string
          user_id: string
        }
        Update: {
          amount?: number
          block_number?: number | null
          blockchain?: string
          created_at?: string | null
          from_address?: string
          gas_fee?: number | null
          id?: string
          status?: string | null
          timestamp?: string
          to_address?: string
          token_address?: string | null
          token_symbol?: string
          tx_hash?: string
          tx_type?: string
          user_id?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          description: string | null
          favicon_url: string | null
          id: string
          is_favorite: boolean
          metadata: Json
          project_id: string | null
          tags: string[]
          title: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          favicon_url?: string | null
          id?: string
          is_favorite?: boolean
          metadata?: Json
          project_id?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          favicon_url?: string | null
          id?: string
          is_favorite?: boolean
          metadata?: Json
          project_id?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
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
      collaboration_sessions: {
        Row: {
          created_at: string
          cursor_position: Json | null
          id: string
          last_seen: string
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          cursor_position?: Json | null
          id?: string
          last_seen?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          cursor_position?: Json | null
          id?: string
          last_seen?: string
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      context_sessions: {
        Row: {
          agent_id: string
          context_data: Json | null
          created_at: string | null
          id: string
          messages: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          context_data?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          context_data?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "context_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "context7_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      context7_agents: {
        Row: {
          context_window: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          knowledge_base: string[] | null
          memory_type: string | null
          model: string
          name: string
          performance_metrics: Json | null
          tools: string[] | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_window?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base?: string[] | null
          memory_type?: string | null
          model: string
          name: string
          performance_metrics?: Json | null
          tools?: string[] | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_window?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base?: string[] | null
          memory_type?: string | null
          model?: string
          name?: string
          performance_metrics?: Json | null
          tools?: string[] | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crypto_news_feed: {
        Row: {
          author: string | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          published_at: string
          sentiment_score: number | null
          source: string
          summary: string | null
          symbols_mentioned: string[] | null
          title: string
          url: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          published_at: string
          sentiment_score?: number | null
          source: string
          summary?: string | null
          symbols_mentioned?: string[] | null
          title: string
          url: string
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          sentiment_score?: number | null
          source?: string
          summary?: string | null
          symbols_mentioned?: string[] | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      defi_positions: {
        Row: {
          amount_deposited: number
          apy: number | null
          blockchain: string
          contract_address: string | null
          created_at: string | null
          current_value: number | null
          id: string
          impermanent_loss: number | null
          position_type: string
          protocol_name: string
          rewards_earned: number | null
          token_pair: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_deposited: number
          apy?: number | null
          blockchain?: string
          contract_address?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          impermanent_loss?: number | null
          position_type: string
          protocol_name: string
          rewards_earned?: number | null
          token_pair?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_deposited?: number
          apy?: number | null
          blockchain?: string
          contract_address?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          impermanent_loss?: number | null
          position_type?: string
          protocol_name?: string
          rewards_earned?: number | null
          token_pair?: string | null
          updated_at?: string | null
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
      exchange_configs: {
        Row: {
          api_key: string | null
          created_at: string | null
          enabled: boolean | null
          id: string
          name: string
          password: string | null
          sandbox: boolean | null
          secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          password?: string | null
          sandbox?: boolean | null
          secret?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          password?: string | null
          sandbox?: boolean | null
          secret?: string | null
          updated_at?: string | null
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
          change_24h: number | null
          change_percentage_24h: number | null
          exchange: string
          high_24h: number | null
          id: string
          last_updated: string | null
          low_24h: number | null
          market_cap_aud: number | null
          market_cap_usd: number | null
          price_aud: number
          price_usd: number
          symbol: string
          volume_24h_aud: number | null
          volume_24h_usd: number | null
        }
        Insert: {
          change_24h?: number | null
          change_percentage_24h?: number | null
          exchange?: string
          high_24h?: number | null
          id?: string
          last_updated?: string | null
          low_24h?: number | null
          market_cap_aud?: number | null
          market_cap_usd?: number | null
          price_aud: number
          price_usd: number
          symbol: string
          volume_24h_aud?: number | null
          volume_24h_usd?: number | null
        }
        Update: {
          change_24h?: number | null
          change_percentage_24h?: number | null
          exchange?: string
          high_24h?: number | null
          id?: string
          last_updated?: string | null
          low_24h?: number | null
          market_cap_aud?: number | null
          market_cap_usd?: number | null
          price_aud?: number
          price_usd?: number
          symbol?: string
          volume_24h_aud?: number | null
          volume_24h_usd?: number | null
        }
        Relationships: []
      }
      news_analysis: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          published_at: string
          sentiment_label: string | null
          sentiment_score: number | null
          source: string
          summary: string | null
          symbols_mentioned: string[] | null
          title: string
          url: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          source: string
          summary?: string | null
          symbols_mentioned?: string[] | null
          title: string
          url: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          source?: string
          summary?: string | null
          symbols_mentioned?: string[] | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      nft_collections: {
        Row: {
          blockchain: string
          contract_address: string
          created_at: string | null
          floor_price: number | null
          id: string
          metadata: Json | null
          name: string
          total_supply: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blockchain?: string
          contract_address: string
          created_at?: string | null
          floor_price?: number | null
          id?: string
          metadata?: Json | null
          name: string
          total_supply?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blockchain?: string
          contract_address?: string
          created_at?: string | null
          floor_price?: number | null
          id?: string
          metadata?: Json | null
          name?: string
          total_supply?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nft_items: {
        Row: {
          collection_id: string
          created_at: string | null
          current_price: number | null
          id: string
          image_url: string | null
          last_sale_price: number | null
          name: string | null
          owned: boolean | null
          rarity_rank: number | null
          token_id: string
          traits: Json | null
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          current_price?: number | null
          id?: string
          image_url?: string | null
          last_sale_price?: number | null
          name?: string | null
          owned?: boolean | null
          rarity_rank?: number | null
          token_id: string
          traits?: Json | null
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          current_price?: number | null
          id?: string
          image_url?: string | null
          last_sale_price?: number | null
          name?: string | null
          owned?: boolean | null
          rarity_rank?: number | null
          token_id?: string
          traits?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "nft_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          average_fill_price: number | null
          bot_id: string | null
          cancelled_at: string | null
          created_at: string | null
          exchange: string | null
          exchange_order_id: string | null
          fees: number | null
          filled_at: string | null
          filled_quantity: number | null
          id: string
          mode: Database["public"]["Enums"]["trading_mode"] | null
          portfolio_id: string | null
          price: number | null
          quantity: number
          side: string
          status: Database["public"]["Enums"]["order_status"] | null
          stop_price: number | null
          symbol: string
          type: Database["public"]["Enums"]["order_type"]
          user_id: string
        }
        Insert: {
          average_fill_price?: number | null
          bot_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          exchange?: string | null
          exchange_order_id?: string | null
          fees?: number | null
          filled_at?: string | null
          filled_quantity?: number | null
          id?: string
          mode?: Database["public"]["Enums"]["trading_mode"] | null
          portfolio_id?: string | null
          price?: number | null
          quantity: number
          side: string
          status?: Database["public"]["Enums"]["order_status"] | null
          stop_price?: number | null
          symbol: string
          type: Database["public"]["Enums"]["order_type"]
          user_id: string
        }
        Update: {
          average_fill_price?: number | null
          bot_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          exchange?: string | null
          exchange_order_id?: string | null
          fees?: number | null
          filled_at?: string | null
          filled_quantity?: number | null
          id?: string
          mode?: Database["public"]["Enums"]["trading_mode"] | null
          portfolio_id?: string | null
          price?: number | null
          quantity?: number
          side?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          stop_price?: number | null
          symbol?: string
          type?: Database["public"]["Enums"]["order_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
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
          current_balance: number | null
          id: string
          initial_balance: number | null
          is_default: boolean | null
          mode: Database["public"]["Enums"]["trading_mode"] | null
          name: string
          positions: Json | null
          total_pnl: number | null
          total_pnl_percentage: number | null
          total_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_default?: boolean | null
          mode?: Database["public"]["Enums"]["trading_mode"] | null
          name?: string
          positions?: Json | null
          total_pnl?: number | null
          total_pnl_percentage?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_default?: boolean | null
          mode?: Database["public"]["Enums"]["trading_mode"] | null
          name?: string
          positions?: Json | null
          total_pnl?: number | null
          total_pnl_percentage?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          live_balance: number | null
          paper_balance: number | null
          subscription_expires_at: string | null
          subscription_tier: string | null
          trading_mode: Database["public"]["Enums"]["trading_mode"] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          live_balance?: number | null
          paper_balance?: number | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          trading_mode?: Database["public"]["Enums"]["trading_mode"] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          live_balance?: number | null
          paper_balance?: number | null
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          trading_mode?: Database["public"]["Enums"]["trading_mode"] | null
          updated_at?: string | null
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
          strategy_type: Database["public"]["Enums"]["strategy_type"]
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
          strategy_type: Database["public"]["Enums"]["strategy_type"]
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
          strategy_type?: Database["public"]["Enums"]["strategy_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      tax_transactions: {
        Row: {
          amount: number
          capital_gain_loss: number | null
          cost_basis: number | null
          created_at: string | null
          exchange: string | null
          fee: number | null
          id: string
          price_per_unit: number
          symbol: string
          tax_year: number
          total_value: number
          transaction_date: string
          transaction_id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          capital_gain_loss?: number | null
          cost_basis?: number | null
          created_at?: string | null
          exchange?: string | null
          fee?: number | null
          id?: string
          price_per_unit: number
          symbol: string
          tax_year: number
          total_value: number
          transaction_date: string
          transaction_id: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          capital_gain_loss?: number | null
          cost_basis?: number | null
          created_at?: string | null
          exchange?: string | null
          fee?: number | null
          id?: string
          price_per_unit?: number
          symbol?: string
          tax_year?: number
          total_value?: number
          transaction_date?: string
          transaction_id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_history: {
        Row: {
          amount: number
          created_at: string | null
          exchange_id: string
          id: string
          order_id: string | null
          price: number | null
          side: string
          status: string | null
          symbol: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          exchange_id: string
          id?: string
          order_id?: string | null
          price?: number | null
          side: string
          status?: string | null
          symbol: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          exchange_id?: string
          id?: string
          order_id?: string | null
          price?: number | null
          side?: string
          status?: string | null
          symbol?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_history_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchange_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_bots: {
        Row: {
          ai_model: string | null
          config: Json | null
          created_at: string | null
          current_value: number | null
          id: string
          initial_investment: number | null
          last_trade_at: string | null
          max_position_size: number | null
          mode: Database["public"]["Enums"]["trading_mode"] | null
          name: string
          performance: Json | null
          portfolio_id: string | null
          risk_level: string | null
          status: Database["public"]["Enums"]["bot_status"] | null
          stop_loss_percentage: number | null
          strategy: Database["public"]["Enums"]["strategy_type"]
          take_profit_percentage: number | null
          target_symbols: string[] | null
          total_trades: number | null
          updated_at: string | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          ai_model?: string | null
          config?: Json | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          initial_investment?: number | null
          last_trade_at?: string | null
          max_position_size?: number | null
          mode?: Database["public"]["Enums"]["trading_mode"] | null
          name: string
          performance?: Json | null
          portfolio_id?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["bot_status"] | null
          stop_loss_percentage?: number | null
          strategy: Database["public"]["Enums"]["strategy_type"]
          take_profit_percentage?: number | null
          target_symbols?: string[] | null
          total_trades?: number | null
          updated_at?: string | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          ai_model?: string | null
          config?: Json | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          initial_investment?: number | null
          last_trade_at?: string | null
          max_position_size?: number | null
          mode?: Database["public"]["Enums"]["trading_mode"] | null
          name?: string
          performance?: Json | null
          portfolio_id?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["bot_status"] | null
          stop_loss_percentage?: number | null
          strategy?: Database["public"]["Enums"]["strategy_type"]
          take_profit_percentage?: number | null
          target_symbols?: string[] | null
          total_trades?: number | null
          updated_at?: string | null
          user_id?: string
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_bots_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_signals: {
        Row: {
          bot_id: string | null
          confidence: number
          created_at: string | null
          executed_at: string | null
          execution_status: string | null
          id: string
          price: number
          reasoning: string | null
          signal_type: string
          symbol: string
          technical_indicators: Json | null
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          confidence: number
          created_at?: string | null
          executed_at?: string | null
          execution_status?: string | null
          id?: string
          price: number
          reasoning?: string | null
          signal_type: string
          symbol: string
          technical_indicators?: Json | null
          user_id: string
        }
        Update: {
          bot_id?: string | null
          confidence?: number
          created_at?: string | null
          executed_at?: string | null
          execution_status?: string | null
          id?: string
          price?: number
          reasoning?: string | null
          signal_type?: string
          symbol?: string
          technical_indicators?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_signals_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "trading_bots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_news_preferences: {
        Row: {
          created_at: string | null
          followed_symbols: string[] | null
          id: string
          notification_enabled: boolean | null
          preferred_sources: string[] | null
          sentiment_filter: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          followed_symbols?: string[] | null
          id?: string
          notification_enabled?: boolean | null
          preferred_sources?: string[] | null
          sentiment_filter?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          followed_symbols?: string[] | null
          id?: string
          notification_enabled?: boolean | null
          preferred_sources?: string[] | null
          sentiment_filter?: string | null
          updated_at?: string | null
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
          created_at: string | null
          id: string
          setting_name: string
          setting_value: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_name: string
          setting_value?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_name?: string
          setting_value?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          symbols: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          symbols?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          symbols?: string[] | null
          updated_at?: string | null
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
      alert_type:
        | "price_above"
        | "price_below"
        | "volume_spike"
        | "sentiment_change"
      bot_status: "active" | "paused" | "stopped" | "error"
      order_status: "pending" | "filled" | "cancelled" | "rejected"
      order_type: "market" | "limit" | "stop_loss" | "take_profit"
      strategy_type:
        | "trend_following"
        | "mean_reversion"
        | "scalping"
        | "breakout"
        | "arbitrage"
        | "grid"
        | "momentum"
        | "pattern_recognition"
        | "sentiment"
        | "custom"
      trading_mode: "paper" | "live"
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
      alert_type: [
        "price_above",
        "price_below",
        "volume_spike",
        "sentiment_change",
      ],
      bot_status: ["active", "paused", "stopped", "error"],
      order_status: ["pending", "filled", "cancelled", "rejected"],
      order_type: ["market", "limit", "stop_loss", "take_profit"],
      strategy_type: [
        "trend_following",
        "mean_reversion",
        "scalping",
        "breakout",
        "arbitrage",
        "grid",
        "momentum",
        "pattern_recognition",
        "sentiment",
        "custom",
      ],
      trading_mode: ["paper", "live"],
      user_role: ["admin", "trader", "viewer", "api_only"],
    },
  },
} as const
