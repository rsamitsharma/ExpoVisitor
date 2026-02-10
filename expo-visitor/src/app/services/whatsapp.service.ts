import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000';
//const API_BASE_URL = 'http://103.255.190.241:3000';

export interface WhatsAppMessageDto {
    apiKey: string;
    to: string;
    templateName: string;
    languageCode?: string;
    headerType?: string;
    bodyParams?: { type?: string; text: string }[];
    buttonParams?: { type: string; text: string }[];
}

export interface ApiResponse<T> {
    success: boolean;
    requestPayload: any;
    response: T;
}

@Injectable({
    providedIn: 'root',
})
export class WhatsappService {
    private apiUrl = `${API_BASE_URL}/whatsapp`;

    constructor(private http: HttpClient) { }

    send(data: WhatsAppMessageDto): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/send`, data);
    }
}
