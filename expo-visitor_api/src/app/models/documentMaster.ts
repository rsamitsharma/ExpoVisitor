import { Int_Common } from "./global";

export interface Int_DocumentMaster extends Int_Common {
    DocumentID: number;
    VisitorID: number;
    ExpoID: number;
    DocumentType: string;
    DocumentName: string;
    DocumentPath: string;
}