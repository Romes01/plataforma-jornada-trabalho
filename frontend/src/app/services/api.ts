
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface TimeEntry {
  id: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  durationMinutes: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, {
      email,
      password
    });
  }

  register(name: string, email: string, password: string): Observable<{
    id: string;
    name: string;
    email: string;
  }> {
    return this.http.post<{
      id: string;
      name: string;
      email: string;
    }>(`${API_URL}/auth/register`, {
      name,
      email,
      password
    });
  }

  getTimeEntries(token: string): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(`${API_URL}/timeentries`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  startWorkday(token: string): Observable<unknown> {
    return this.http.post(`${API_URL}/timeentries/start`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  endWorkday(token: string): Observable<unknown> {
    return this.http.post(`${API_URL}/timeentries/end`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
