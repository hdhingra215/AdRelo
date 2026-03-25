// Generate this file from your Supabase schema using:
// npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
//
// Below are manual types matching the migrations in supabase/migrations/.

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      release_orders: {
        Row: {
          id: string;
          ro_number: string;
          date: string;
          client_id: string;
          publication: string;
          edition: string;
          advertisement_category: string;
          caption: string;
          size: string;
          rate: number;
          card_rate: number;
          discount: number;
          net_amount: number;
          gst: number;
          total_amount: number;
          publishing_date: string;
          special_comment: string;
          bill_generated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ro_number: string;
          date: string;
          client_id: string;
          publication: string;
          edition: string;
          advertisement_category: string;
          caption: string;
          size: string;
          rate: number;
          card_rate: number;
          discount: number;
          net_amount: number;
          gst: number;
          total_amount: number;
          publishing_date: string;
          special_comment?: string;
          bill_generated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          ro_number?: string;
          date?: string;
          client_id?: string;
          publication?: string;
          edition?: string;
          advertisement_category?: string;
          caption?: string;
          size?: string;
          rate?: number;
          card_rate?: number;
          discount?: number;
          net_amount?: number;
          gst?: number;
          total_amount?: number;
          publishing_date?: string;
          special_comment?: string;
          bill_generated?: boolean;
          created_at?: string;
        };
      };
      bills: {
        Row: {
          id: string;
          bill_number: string;
          date: string;
          release_order_id: string;
          client_id: string;
          amount: number;
          discount: number;
          net_amount: number;
          gst: number;
          total_amount: number;
          amount_in_words: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          bill_number: string;
          date: string;
          release_order_id: string;
          client_id: string;
          amount: number;
          discount: number;
          net_amount: number;
          gst: number;
          total_amount: number;
          amount_in_words: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          bill_number?: string;
          date?: string;
          release_order_id?: string;
          client_id?: string;
          amount?: number;
          discount?: number;
          net_amount?: number;
          gst?: number;
          total_amount?: number;
          amount_in_words?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
