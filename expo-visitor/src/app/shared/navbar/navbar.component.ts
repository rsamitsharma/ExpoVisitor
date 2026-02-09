import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isReportMenuOpen = false;
  private closeTimeout: any;

  toggleReportMenu(): void {
    this.isReportMenuOpen = !this.isReportMenuOpen;
    if (this.isReportMenuOpen) {
      this.cancelClose();
    }
  }

  closeReportMenu(): void {
    this.closeTimeout = setTimeout(() => {
      this.isReportMenuOpen = false;
    }, 200);
  }

  cancelClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }
}
