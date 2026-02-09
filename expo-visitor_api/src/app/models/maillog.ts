export interface Int_MailLog {
  RID?: number;
  VisitorID?: number;
  ExpoID?: number;
  RecipientEmail: string;
  Subject: string;
  Body: string;
  Status: 'Sent' | 'Failed' | 'Pending';
  SentDate?: Date;
  ErrorMessage?: string;
  CreatedDate?: Date;
  UpdatedDate?: Date;
}

export type MailStatus = 'Sent' | 'Failed' | 'Pending';
