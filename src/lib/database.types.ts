type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
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
        }
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
        }
      >
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
