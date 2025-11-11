import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
})
export class UserList {
  users: User[] = [];
  username = '';
  email = '';
  role = '';
  password = '';

  editId?: number;
  editUsername = '';
  editEmail = '';
  editRole = '';

  constructor(private userService: UserService) {
    this.load();
  }

  load() {
    this.userService.getAllUsers().subscribe(us => this.users = us);
  }

  add() {
    if (!this.username.trim() || !this.email.trim()) return;
    const user: User = { username: this.username, email: this.email, role: this.role || 'USER', password: this.password };
    this.userService.createUser(user).subscribe(() => {
      this.username = '';
      this.email = '';
      this.role = '';
      this.password = '';
      this.load();
    });
  }

  remove(id: number) {
    if (confirm('Delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => this.load());
    }
  }

  startEdit(u: User) {
    this.editId = u.id;
    this.editUsername = u.username ?? '';
    this.editEmail = u.email ?? '';
    this.editRole = u.role ?? '';
  }

  cancelEdit() {
    this.editId = undefined;
    this.editUsername = '';
    this.editEmail = '';
    this.editRole = '';
  }

  saveEdit(id: number) {
    const payload: Partial<User> = {
      username: this.editUsername,
      email: this.editEmail,
      role: this.editRole
    };
    this.userService.updateUser(id, payload).subscribe(() => {
      this.cancelEdit();
      this.load();
    });
  }
}
