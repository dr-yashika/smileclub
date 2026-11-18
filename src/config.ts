// Supabase project address and publishable key. Both are public by design: the database only
// lets this key call enrol() and submit_events() (see supabase/schema.sql), nothing else.
// Leave them empty to run the app on its own (demo, nothing uploaded).
export const SUPABASE_URL: string = 'https://avratbccwstpuqdjbjac.supabase.co';
export const SUPABASE_KEY: string = 'sb_publishable_-d_C6MV-WtViCB1Z-XDG6Q_Rm7uC3U7';

export const hasBackend = (): boolean => SUPABASE_URL !== '' && SUPABASE_KEY !== '';
