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

    public static async update(data: Record<string, unknown>, table: string, id?: number) {
        const supabase = this.getSupabaseClient();

        let supabaseError: PostgrestError | null;

        if (id != null) {
            const { error } = await supabase.from(table).update(data).match({ id });

            supabaseError = error;
        } else {
            const { error } = await supabase.from(table).update(data);

            supabaseError = error;
        }

        if (supabaseError) {
            throw new Error('Error in supabase - ' + supabaseError.message)
        }
    }

    public static async insert(data: Record<string, unknown>, table: string) {
        const supabase = this.getSupabaseClient();

        const { error } = await supabase.from(table).insert(data);

        if (error) {
            throw new Error('Error in supabase - ' + error.message)
        }
    }

    public static async delete(id: string, table: string) {
        const supabase = this.getSupabaseClient();

        const { error } = await supabase.from(table).delete().match({ id });

        if (error) {
            throw new Error('Error in supabase - ' + error.message)
        }
    }

    public static async select<T>(table: string, fields?: string): Promise<T> {
        const supabase = this.getSupabaseClient();

        const { data, error } = await supabase.from(table).select(fields ?? '*').returns<T>();

        if (error) {
            throw new Error('Error in supabase - ' + error.message)
        }

        return data ?? [] as T;
    }

    public static async selectById(id: string, table: string, fields?: string) {
        const supabase = this.getSupabaseClient();

        const { data, error } = await supabase.from(table).select(fields ?? '*').match({ id });

        if (error) {
            throw new Error('Error in supabase - ' + error.message)
        }

        return data;
    }
}