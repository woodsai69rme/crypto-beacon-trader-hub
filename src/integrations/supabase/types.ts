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
      trading_bots: {
        Row: {
          active_since: string
          alerts: Json | null
          created_at: string
          id: string
          last_trade: Json | null
          name: string
          performance: Json
          status: string
          strategy: string
          underperforming: boolean | null
          user_id: string
        }
        Insert: {
          active_since?: string
          alerts?: Json | null
          created_at?: string
          id?: string
          last_trade?: Json | null
          name: string
          performance?: Json
          status?: string
          strategy: string
          underperforming?: boolean | null
          user_id: string
        }
        Update: {
          active_since?: string
          alerts?: Json | null
          created_at?: string
          id?: string
          last_trade?: Json | null
          name?: string
          performance?: Json
          status?: string
          strategy?: string
          underperforming?: boolean | null
          user_id?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
