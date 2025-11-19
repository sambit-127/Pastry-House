// types/user.ts
export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: string | null;
  date_of_birth: string; // ISO date like "2002-04-22"
  gender: string;
  weight: string; // API returns string like "81.60"
  height: number;
  target: string;
  target_weight: number;
  target_bmi: number;
  daily_water_goal: number;
  water_reminder: boolean;
  created_at: string;
  updated_at: string;
}