import { Component, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get isLoginRoute() {
    return this.router.url.startsWith('/login');
  }

  get isRegisterRoute() {
    return this.router.url.startsWith('/register');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      const prefersDark = saved ? saved === 'dark' : (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', !!prefersDark);
      }
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }
}
