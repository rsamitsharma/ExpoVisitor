import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService, MailLog } from '../../services/mail.service';
import { ExpoMasterService, ExpoMaster } from '../../services/expo-master.service';

@Component({
  selector: 'app-mail-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mail-log.component.html',
  styleUrl: './mail-log.component.css',
})
export class MailLogComponent implements OnInit {
  allMailLogs: MailLog[] = [];
  mailLogs: MailLog[] = [];
  expos: ExpoMaster[] = [];

  selectedExpoId: number | null = null;
  selectedStatus: string | null = null;

  isLoading = true;
  errorMessage = '';

  showModal = false;
  selectedLog: MailLog | null = null;

  constructor(
    private mailService: MailService,
    private expoMasterService: ExpoMasterService,
  ) { }

  ngOnInit(): void {
    this.loadExpos();
    this.loadMailLogs();
  }

  loadExpos(): void {
    this.expoMasterService.getAll().subscribe({
      next: (response) => {
        this.expos = response.data || [];
      },
    });
  }

  loadMailLogs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.mailService.getLogs().subscribe({
      next: (response) => {
        this.allMailLogs = response.data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load mail logs. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    let filtered = [...this.allMailLogs];

    if (this.selectedExpoId) {
      filtered = filtered.filter(log => log.ExpoID === this.selectedExpoId);
    }
    if (this.selectedStatus) {
      filtered = filtered.filter(log => log.Status === this.selectedStatus);
    }

    this.mailLogs = filtered;
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Sent': return 'status-sent';
      case 'Failed': return 'status-failed';
      case 'Pending': return 'status-pending';
      default: return '';
    }
  }

  getExpoName(expoId: number): string {
    const expo = this.expos.find(e => e.RID === expoId);
    return expo ? expo.ExpoName : '-';
  }

  viewLog(log: MailLog): void {
    this.selectedLog = log;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedLog = null;
  }

  truncateSubject(subject: string, maxLength: number = 50): string {
    if (subject.length <= maxLength) return subject;
    return subject.substring(0, maxLength) + '...';
  }
}
