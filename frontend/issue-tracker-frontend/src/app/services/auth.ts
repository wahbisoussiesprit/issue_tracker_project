import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'it_auth';
  private tokenSubject = new BehaviorSubject<string | null>(this.read()?.token ?? null);
  private roleSubject = new BehaviorSubject<string | null>(this.read()?.role ?? null);
  private usernameSubject = new BehaviorSubject<string | null>(this.read()?.username ?? null);

  token$ = this.tokenSubject.asObservable();
  role$ = this.roleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8080/api/auth/login', { username, password })
      .pipe(tap(res => this.setAuth(res)));
  }

  logout() {
    this.clearAuth();
  }

  get token(): string | null { return this.tokenSubject.value; }
  get role(): string | null { return this.roleSubject.value; }
  get isAdmin(): boolean { return (this.roleSubject.value ?? '').toUpperCase().includes('ADMIN'); }
  get isAuthenticated(): boolean { return !!this.tokenSubject.value; }

  private setAuth(res: LoginResponse) {
    localStorage.setItem(this.storageKey, JSON.stringify(res));
    this.tokenSubject.next(res.token);
    this.roleSubject.next(res.role);
    this.usernameSubject.next(res.username);
  }

  private clearAuth() {
    localStorage.removeItem(this.storageKey);
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
    this.usernameSubject.next(null);
  }

  private read(): LoginResponse | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as LoginResponse : null;
    } catch { return null; }
  }
}
