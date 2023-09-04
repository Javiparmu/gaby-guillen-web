import { createClient, type PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types";

export class SupabaseService {
    public static supabaseClient: SupabaseClient | undefined;

    public static getSupabaseClient() {
        if (!this.supabaseClient) {
            const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
            const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

            this.supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
        }

        return this.supabaseClient;
    }

    public static async select<T>(table: string, fields?: string, match?: Record<string, unknown>): Promise<T[]> {
        const supabase = this.getSupabaseClient();

        const { data, error } = await supabase.from(table).select(fields ?? '*').match(match ?? {}).returns<T[]>();

        if (error) {
            throw new Error('Error in supabase - ' + error.message)
        }

        return data ?? [] as T;
    }

    public static async selectBySlug<T>(slug: string, table: string, fields?: string): Promise<T[]> {
        const supabase = this.getSupabaseClient();

        const { data, error } = await supabase.from(table).select(fields ?? '*').match({ slug }).returns<T[]>();

        if (error) {
            throw new Error('Error in supabase - ' + error.message)
        }

        return data;
    }
}