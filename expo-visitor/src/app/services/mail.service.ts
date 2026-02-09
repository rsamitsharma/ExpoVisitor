import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000';
//const API_BASE_URL = 'http://103.255.190.241:3000';

export interface MailLog {
  RID: number;
  VisitorID: number;
  ExpoID: number;
  RecipientEmail: string;
  Subject: string;
  Body: string;
  Status: 'Sent' | 'Failed' | 'Pending';
  SentDate: string | null;
  ErrorMessage: string | null;
  CreatedDate: string;
  UpdatedDate: string;
}

export interface SendVisitorConfirmationDto {
  VisitorID: number;
  ExpoID: number;
  RecipientEmail: string;
  VisitorName: string;
  ExpoName?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private apiUrl = `${API_BASE_URL}/mail`;

  constructor(private http: HttpClient) { }

  sendVisitorConfirmation(data: SendVisitorConfirmationDto): Observable<ApiResponse<MailLog>> {
    return this.http.post<ApiResponse<MailLog>>(`${this.apiUrl}/send-visitor-confirmation`, data);
  }

  getLogs(status?: string, expoId?: number, limit?: number): Observable<ApiResponse<MailLog[]>> {
    const params: any = {};
    if (status) params.status = status;
    if (expoId) params.expoId = expoId.toString();
    if (limit) params.limit = limit.toString();

    return this.http.get<ApiResponse<MailLog[]>>(`${this.apiUrl}/logs`, { params });
  }

  getLog(id: number): Observable<ApiResponse<MailLog>> {
    return this.http.get<ApiResponse<MailLog>>(`${this.apiUrl}/log`, {
      params: { id: id.toString() },
    });
  }

  getLogsByVisitor(visitorId: number): Observable<ApiResponse<MailLog[]>> {
    return this.http.get<ApiResponse<MailLog[]>>(`${this.apiUrl}/logs-by-visitor`, {
      params: { visitorId: visitorId.toString() },
    });
  }
}
