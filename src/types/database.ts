export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string;
          card_number: string;
          card_holder: string;
          card_month: string;
          card_year: string;
          card_cvv: string;
          card_type: string;
          created_at: string;
          user_id?: string;
        };
        Insert: {
          id?: string;
          card_number: string;
          card_holder: string;
          card_month: string;
          card_year: string;
          card_cvv: string;
          card_type: string;
          created_at?: string;
          user_id?: string;
        };
        Update: {
          id?: string;
          card_number?: string;
          card_holder?: string;
          card_month?: string;
          card_year?: string;
          card_cvv?: string;
          card_type?: string;
          created_at?: string;
          user_id?: string;
        };
      };
    };
  };
}
