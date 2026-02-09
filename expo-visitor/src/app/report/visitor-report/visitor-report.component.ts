import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitorMasterService, VisitorMaster } from '../../services/visitor-master.service';
import { ExpoMasterService, ExpoMaster } from '../../services/expo-master.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-visitor-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitor-report.component.html',
  styleUrl: './visitor-report.component.css',
})
export class VisitorReportComponent implements OnInit {
  allVisitors: VisitorMaster[] = [];
  visitors: VisitorMaster[] = [];
  expos: ExpoMaster[] = [];
  selectedExpoId: number | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  uploadingVisitorId: number | null = null;

  showModal = false;
  selectedVisitor: VisitorMaster | null = null;
  visitorDocuments: any[] = [];
  isLoadingDocuments = false;

  showDeleteConfirm = false;
  deletingVisitor: VisitorMaster | null = null;
  isDeleting = false;

  constructor(
    private visitorMasterService: VisitorMasterService,
    private expoMasterService: ExpoMasterService,
  ) { }

  ngOnInit(): void {
    this.loadExpos();
    this.loadVisitors();
  }

  loadExpos(): void {
    this.expoMasterService.getAll().subscribe({
      next: (response) => {
        this.expos = response.data || [];
      },
    });
  }

  loadVisitors(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.visitorMasterService.getAll().subscribe({
      next: (response) => {
        this.allVisitors = response.data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Failed to load visitors. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onExpoFilterChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.selectedExpoId) {
      this.visitors = this.allVisitors.filter(v => v.ExpoID === this.selectedExpoId);
    } else {
      this.visitors = [...this.allVisitors];
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getImageUrl(imagePath: string): string {
    return this.visitorMasterService.getImageUrl(imagePath);
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  onDocumentSelect(event: Event, visitor: VisitorMaster): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadDocument(visitor, file);
      input.value = '';
    }
  }

  uploadDocument(visitor: VisitorMaster, file: File): void {
    this.uploadingVisitorId = visitor.RID;
    this.errorMessage = '';
    this.successMessage = '';

    this.visitorMasterService.addDocument(visitor.RID, visitor.ExpoID, file).subscribe({
      next: () => {
        this.successMessage = `Document added successfully for ${visitor.FullName}`;
        this.uploadingVisitorId = null;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to upload document. Please try again.';
        this.uploadingVisitorId = null;
      },
    });
  }

  viewVisitor(visitor: VisitorMaster): void {
    this.selectedVisitor = visitor;
    this.showModal = true;
    this.isLoadingDocuments = true;
    this.visitorDocuments = [];

    this.visitorMasterService.getDocuments(visitor.RID).subscribe({
      next: (response) => {
        this.visitorDocuments = response.data || [];
        this.isLoadingDocuments = false;
      },
      error: () => {
        this.isLoadingDocuments = false;
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedVisitor = null;
    this.visitorDocuments = [];
  }

  getDocumentUrl(docPath: string): string {
    return this.visitorMasterService.getImageUrl(docPath);
  }

  getExpoName(expoId: number): string {
    const expo = this.expos.find(e => e.RID === expoId);
    return expo ? expo.ExpoName : '-';
  }

  isImageDocument(name: string): boolean {
    const ext = (name || '').toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  }

  confirmDelete(visitor: VisitorMaster): void {
    this.deletingVisitor = visitor;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletingVisitor = null;
  }

  deleteVisitor(): void {
    if (!this.deletingVisitor) return;

    this.isDeleting = true;
    this.visitorMasterService.delete(this.deletingVisitor.RID).subscribe({
      next: () => {
        this.successMessage = `${this.deletingVisitor!.FullName} has been deleted.`;
        this.allVisitors = this.allVisitors.filter(v => v.RID !== this.deletingVisitor!.RID);
        this.visitors = this.visitors.filter(v => v.RID !== this.deletingVisitor!.RID);
        this.showDeleteConfirm = false;
        this.deletingVisitor = null;
        this.isDeleting = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete visitor.';
        this.isDeleting = false;
        this.showDeleteConfirm = false;
        this.deletingVisitor = null;
      },
    });
  }

  downloadExcel(): void {
    if (this.visitors.length === 0) return;

    const data = this.visitors.map(v => ({
      'Full Name': v.FullName,
      'Expo': this.getExpoName(v.ExpoID),
      'Email': v.EmailAddress,
      'Phone': v.PhoneNumber,
      'Company': v.CompanyName,
      'Designation': v.Designation,
      'City': v.City,
      'State': v.AreaOfInterest,
      'Purpose of Visit': v.PurposeOfVisit,
      'Registration Date': this.formatDate(v.CreatedDate),
      'Status': this.getStatusText(v.IsActive)
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitors');

    // Auto-size columns
    const colWidths = Object.keys(data[0]).map(key => ({ wch: Math.max(key.length, 20) }));
    ws['!cols'] = colWidths;

    const fileName = `Visitor_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
