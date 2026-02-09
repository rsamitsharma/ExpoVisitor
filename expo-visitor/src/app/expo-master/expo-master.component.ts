import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpoMasterService } from '../services/expo-master.service';

interface ExpoMasterForm {
  expoName: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  openingTime: string;
  closingTime: string;
}

@Component({
  selector: 'app-expo-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expo-master.component.html',
  styleUrl: './expo-master.component.css',
})
export class ExpoMasterComponent {
  form: ExpoMasterForm = {
    expoName: '',
    shortDescription: '',
    startDate: '',
    endDate: '',
    openingTime: '10:00',
    closingTime: '18:00',
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private expoMasterService: ExpoMasterService) {}

  onSubmit(): void {
    if (!this.form.expoName || !this.form.startDate || !this.form.endDate) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      ExpoName: this.form.expoName,
      StartDate: new Date(this.form.startDate).toISOString(),
      EndDate: new Date(this.form.endDate).toISOString(),
    };

    this.expoMasterService.add(payload).subscribe({
      next: () => {
        this.successMessage = 'Expo created successfully!';
        this.isSubmitting = false;
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Failed to create expo. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  private resetForm(): void {
    this.form = {
      expoName: '',
      shortDescription: '',
      startDate: '',
      endDate: '',
      openingTime: '10:00',
      closingTime: '18:00',
    };
  }
}
