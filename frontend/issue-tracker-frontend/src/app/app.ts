import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar'; // ✅ import your Navbar

@Component({
  selector: 'app-root',
  standalone: true, // ✅ tell Angular this is a standalone component
  imports: [RouterOutlet, Navbar], // ✅ include the Navbar here
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('issue-tracker-frontend');
}
