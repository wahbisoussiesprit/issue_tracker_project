import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.username || !this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.auth.register(this.username, this.email, this.password, this.role || undefined).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.loading = false;
        this.error = 'Registration failed';
        console.error(e);
      }
    });
  }
}
