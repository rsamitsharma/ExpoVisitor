import { Int_Common } from './global';

export interface Int_ExpoMaster extends Int_Common {
  ExpoID: number;
  ExpoName: string;
  StartDate: Date;
  EndDate: Date;
}
