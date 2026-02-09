import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://103.255.190.241:3000';

export interface ExpoMaster {
  RID: number;
  ExpoName: string;
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
  CreatedDate: string;
  UpdatedDate: string;
}

export interface CreateExpoMasterDto {
  ExpoName: string;
  StartDate: string;
  EndDate: string;
}

export interface UpdateExpoMasterDto {
  RID: number;
  ExpoName?: string;
  StartDate?: string;
  EndDate?: string;
  IsActive?: boolean;
}

export interface DeleteExpoMasterDto {
  RID: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ExpoMasterService {
  private apiUrl = `${API_BASE_URL}/expomaster`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<ExpoMaster[]>> {
    return this.http.get<ApiResponse<ExpoMaster[]>>(`${this.apiUrl}/getAll`);
  }

  get(id: number): Observable<ApiResponse<ExpoMaster>> {
    return this.http.get<ApiResponse<ExpoMaster>>(`${this.apiUrl}/get`, {
      params: { id: id.toString() },
    });
  }

  add(data: CreateExpoMasterDto): Observable<ApiResponse<ExpoMaster>> {
    return this.http.post<ApiResponse<ExpoMaster>>(`${this.apiUrl}/add`, data);
  }

  update(data: UpdateExpoMasterDto): Observable<ApiResponse<ExpoMaster>> {
    return this.http.post<ApiResponse<ExpoMaster>>(`${this.apiUrl}/update`, data);
  }

  delete(data: DeleteExpoMasterDto): Observable<ApiResponse<ExpoMaster>> {
    return this.http.post<ApiResponse<ExpoMaster>>(`${this.apiUrl}/delete`, data);
  }
}
