import { Int_Common } from "./global";

export interface Int_VisitorMaster extends Int_Common {
  VisitorID: number;
  ExpoID: number;
  FullName: string;
  EmailAddress: string;
  PhoneNumber: string;
  CompanyName: string;
  Designation: string;
  City: string;
  AreaOfInterest: string;
  PurposeOfVisit: string;
  AdditionalComment: string;
  ImagePath?: string;
}
