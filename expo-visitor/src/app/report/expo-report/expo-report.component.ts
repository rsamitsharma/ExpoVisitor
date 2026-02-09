import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpoMasterService, ExpoMaster } from '../../services/expo-master.service';

@Component({
  selector: 'app-expo-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expo-report.component.html',
  styleUrl: './expo-report.component.css',
})
export class ExpoReportComponent implements OnInit {
  expos: ExpoMaster[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private expoMasterService: ExpoMasterService) {}

  ngOnInit(): void {
    this.loadExpos();
  }

  loadExpos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.expoMasterService.getAll().subscribe({
      next: (response) => {
        this.expos = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Failed to load expos. Please try again.';
        this.isLoading = false;
      },
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }
}
