export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Table<Row, Insert, Update = Partial<Insert>, Relationships = []> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: Relationships
}

export type Database = {
  public: {
    Tables: {
      products: Table<
        {
          id: string
          slug: string
          name: string
          category: string | null
          description: string | null
          image_url: string | null
          price: number
          in_stock: boolean
          badge: string | null
          created_at: string
          updated_at: string
        },
        {
          id?: string
          slug: string
          name: string
          category?: string | null
          description?: string | null
          image_url?: string | null
          price: number
          in_stock?: boolean
          badge?: string | null
          created_at?: string
          updated_at?: string
        }
      >
      orders: Table<
        {
          id: string
          user_id: string | null
          status: string
          created_at: string
        },
        {
          id?: string
          user_id?: string | null
          status?: string
          created_at?: string
        },
        Partial<{
          id: string
          user_id: string | null
          status: string
          created_at: string
        }>,
        [{
          foreignKeyName: 'order_items_order_id_fkey'
          columns: ['id']
          isOneToOne: false
          referencedRelation: 'order_items'
          referencedColumns: ['order_id']
        }]
      >
      order_items: Table<
        {
          id: string
          order_id: string
          product_id: string
          quantity: number
        },
        {
          id?: string
          order_id: string
          product_id: string
          quantity?: number
        },
        Partial<{
          id: string
          order_id: string
          product_id: string
          quantity: number
        }>,
        [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      >
    }
    Views: Record<string, never>
    Functions: {
      place_order: {
        Args: { p_items: Json }
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
