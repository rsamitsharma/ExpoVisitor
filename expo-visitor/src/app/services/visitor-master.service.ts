import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://103.255.190.241:3000';

export interface VisitorMaster {
  RID: number;
  ExpoID: number;
  FullName: string;
  EmailAddress: string;
  PhoneNumber: string;
  CompanyName: string;
  Designation: string;
  City: string;
  AreaOfInterest: string;
  PurposeOfVisit: string;
  AdditionalComment?: string;
  ImagePath?: string;
  IsActive: boolean;
  CreatedDate: string;
  UpdatedDate: string;
}

export interface CreateVisitorMasterDto {
  ExpoID: number;
  FullName: string;
  EmailAddress: string;
  PhoneNumber: string;
  CompanyName: string;
  Designation: string;
  City: string;
  AreaOfInterest: string;
  PurposeOfVisit: string;
  AdditionalComment?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class VisitorMasterService {
  private apiUrl = `${API_BASE_URL}/visitormaster`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<VisitorMaster[]>> {
    return this.http.get<ApiResponse<VisitorMaster[]>>(`${this.apiUrl}/getAll`);
  }

  get(id: number): Observable<ApiResponse<VisitorMaster>> {
    return this.http.get<ApiResponse<VisitorMaster>>(`${this.apiUrl}/get`, {
      params: { id: id.toString() },
    });
  }

  add(data: CreateVisitorMasterDto, image?: File): Observable<ApiResponse<VisitorMaster>> {
    const formData = new FormData();
    formData.append('ExpoID', data.ExpoID.toString());
    formData.append('FullName', data.FullName);
    formData.append('EmailAddress', data.EmailAddress);
    formData.append('PhoneNumber', data.PhoneNumber);
    formData.append('CompanyName', data.CompanyName);
    formData.append('Designation', data.Designation);
    formData.append('City', data.City);
    formData.append('AreaOfInterest', data.AreaOfInterest);
    formData.append('PurposeOfVisit', data.PurposeOfVisit);
    if (data.AdditionalComment) {
      formData.append('AdditionalComment', data.AdditionalComment);
    }
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<ApiResponse<VisitorMaster>>(`${this.apiUrl}/add`, formData);
  }

  delete(visitorId: number): Observable<ApiResponse<VisitorMaster>> {
    return this.http.post<ApiResponse<VisitorMaster>>(`${this.apiUrl}/delete`, {
      VisitorID: visitorId,
    });
  }

  addDocument(visitorId: number, expoId: number, document: File, documentType: string = 'Document'): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('VisitorID', visitorId.toString());
    formData.append('ExpoID', expoId.toString());
    formData.append('DocumentType', documentType);
    formData.append('document', document);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/addDocument`, formData);
  }

  getDocuments(visitorId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/getDocuments`, {
      params: { visitorId: visitorId.toString() },
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return `${API_BASE_URL}/${imagePath}`;
  }
}
