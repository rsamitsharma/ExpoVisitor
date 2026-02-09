export interface Int_Common {
  is_active?: boolean;
  created_by?: number;
  updated_by?: number;
  deleted_by?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
