import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitorMasterService, CreateVisitorMasterDto } from '../services/visitor-master.service';
import { ExpoMasterService, ExpoMaster } from '../services/expo-master.service';
import { MailService, SendVisitorConfirmationDto } from '../services/mail.service';
import { WhatsappService, WhatsAppMessageDto } from '../services/whatsapp.service';

interface VisitorForm {
  expoId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  city: string;
  state: string;
  purposeOfVisit: string;
}

interface DocumentFile {
  file: File;
  preview: string;
  name: string;
}

@Component({
  selector: 'app-visitor-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visitor-master.component.html',
  styleUrl: './visitor-master.component.css',
})
export class VisitorMasterComponent implements OnInit {
  form: VisitorForm = {
    expoId: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    city: '',
    state: '',
    purposeOfVisit: '',
  };

  expos: ExpoMaster[] = [];
  selectedExpo: ExpoMaster | null = null;
  profileImage: File | null = null;
  profileImagePreview: string | null = null;
  documents: DocumentFile[] = [];
  isSubmitting = false;
  isLoadingExpos = true;
  successMessage = '';
  errorMessage = '';
  showThankYou = false;
  registeredVisitorName = '';

  // Interest options
  interestOptions: string[] = [
    'Smart Address Management (DHI)',
    'Disaster Management',
    'Citizen Relationship Management',
    'Property and Other Tax Management',
    'Waste Collection Management',
    'Task & Workflow Management',
    'Complaint Redressal System',
    'Property Reassessment',
    'E-Auction',
  ];
  selectedInterests: string[] = [];
  otherInterestSelected = false;
  otherInterestText = '';

  // Voice-to-text
  activeVoiceField: string | null = null;
  private recognition: any = null;

  constructor(
    private visitorMasterService: VisitorMasterService,
    private expoMasterService: ExpoMasterService,
    private mailService: MailService,
    private whatsappService: WhatsappService,
    private ngZone: NgZone
  ) {
    this.initSpeechRecognition();
  }

  ngOnInit(): void {
    this.loadExpos();
  }

  private initSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN';

    this.recognition.onresult = (event: any) => {
      this.ngZone.run(() => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript && this.activeVoiceField) {
          this.setFieldValue(this.activeVoiceField, finalTranscript);
        }
      });
    };

    this.recognition.onend = () => {
      this.ngZone.run(() => {
        this.activeVoiceField = null;
      });
    };

    this.recognition.onerror = () => {
      this.ngZone.run(() => {
        this.activeVoiceField = null;
      });
    };
  }

  startVoice(fieldName: string): void {
    if (!this.recognition) {
      this.errorMessage = 'Speech recognition is not supported in this browser.';
      return;
    }

    if (this.activeVoiceField === fieldName) {
      this.recognition.stop();
      this.activeVoiceField = null;
      return;
    }

    if (this.activeVoiceField) {
      this.recognition.stop();
    }

    this.activeVoiceField = fieldName;
    this.recognition.start();
  }

  private setFieldValue(fieldName: string, value: string): void {
    const current = (this.form as any)[fieldName] || '';
    (this.form as any)[fieldName] = current ? current + ' ' + value : value;
  }

  loadExpos(): void {
    this.isLoadingExpos = true;
    this.expoMasterService.getAll().subscribe({
      next: (response) => {
        this.expos = response.data?.filter((e) => e.IsActive) || [];
        if (this.expos.length > 0) {
          this.form.expoId = this.expos[0].RID;
          this.selectedExpo = this.expos[0];
        }
        this.isLoadingExpos = false;
      },
      error: () => {
        this.isLoadingExpos = false;
      },
    });
  }

  onExpoChange(): void {
    this.selectedExpo = this.expos.find((e) => e.RID === this.form.expoId) || null;
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size should not exceed 5MB';
        return;
      }
      this.profileImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.profileImage = null;
    this.profileImagePreview = null;
  }

  onDocumentSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.size > 10 * 1024 * 1024) {
          this.errorMessage = 'Document size should not exceed 10MB';
          continue;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documents.push({
            file: file,
            preview: e.target?.result as string,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
      input.value = '';
    }
  }

  removeDocument(index: number): void {
    this.documents.splice(index, 1);
  }

  isImageFile(filename: string): boolean {
    const ext = filename.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  onInterestChange(interest: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedInterests.push(interest);
    } else {
      this.selectedInterests = this.selectedInterests.filter((i) => i !== interest);
    }
  }

  onOtherInterestToggle(event: Event): void {
    this.otherInterestSelected = (event.target as HTMLInputElement).checked;
    if (!this.otherInterestSelected) {
      this.otherInterestText = '';
    }
  }

  private getAreaOfInterest(): string {
    const interests = [...this.selectedInterests];
    if (this.otherInterestSelected && this.otherInterestText.trim()) {
      interests.push('Other: ' + this.otherInterestText.trim());
    }
    return interests.join(', ');
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CreateVisitorMasterDto = {
      ExpoID: this.form.expoId!,
      FullName: `${this.form.firstName} ${this.form.lastName}`.trim(),
      EmailAddress: this.form.email,
      PhoneNumber: this.form.phone,
      CompanyName: this.form.company,
      Designation: this.form.designation,
      City: this.form.city,
      AreaOfInterest: this.getAreaOfInterest(),
      PurposeOfVisit: this.form.purposeOfVisit,
    };

    this.visitorMasterService.add(payload, this.profileImage || undefined).subscribe({
      next: (response) => {
        this.registeredVisitorName = payload.FullName;

        // Send confirmation email
        const emailPayload: SendVisitorConfirmationDto = {
          VisitorID: response.data.RID,
          ExpoID: payload.ExpoID,
          RecipientEmail: payload.EmailAddress,
          VisitorName: payload.FullName,
          ExpoName: this.selectedExpo?.ExpoName,
        };

        this.mailService.sendVisitorConfirmation(emailPayload).subscribe({
          next: (mailResponse) => {
            console.log('Confirmation email sent:', mailResponse.data.Status);
          },
          error: (mailError) => {
            console.error('Failed to send confirmation email:', mailError);
            // Don't show error to user - registration was successful
          },
        });

        // Send WhatsApp message

        const whatsappPayload: WhatsAppMessageDto = {
          apiKey: '24ba9ecbfc8b45e0910088296cf47098', // TODO: Replace with your actual WhatsApp API Key
          to: payload.PhoneNumber,
          templateName: 'expo_visitor_msg', // TODO: Replace with your actual Template Name
          languageCode: 'en',
          bodyParams: [
            { type: 'text', text: payload.FullName },
            { type: 'text', text: this.selectedExpo?.ExpoName || 'Expo' },
          ],
        };

        this.whatsappService.send(whatsappPayload).subscribe({
          next: (waResponse) => {
            console.log('WhatsApp message sent:', waResponse);
          },
          error: (waError) => {
            console.error('Failed to send WhatsApp message:', waError);
          },
        });

        this.isSubmitting = false;
        this.resetForm();
        this.showThankYou = true;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to register visitor. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  private validateForm(): boolean {
    if (!this.form.expoId) {
      this.errorMessage = 'Please select an expo.';
      return false;
    }
    if (!this.form.firstName || !this.form.lastName) {
      this.errorMessage = 'Please enter first and last name.';
      return false;
    }
    if (!this.form.email) {
      this.errorMessage = 'Please enter email address.';
      return false;
    }
    if (!this.form.phone) {
      this.errorMessage = 'Please enter phone number.';
      return false;
    }
    if (!this.form.company) {
      this.errorMessage = 'Please enter company/organization name.';
      return false;
    }
    if (this.selectedInterests.length === 0 && !(this.otherInterestSelected && this.otherInterestText.trim())) {
      this.errorMessage = 'Please select at least one area of interest.';
      return false;
    }
    return true;
  }

  closeThankYou(): void {
    this.showThankYou = false;
    this.registeredVisitorName = '';
  }

  private resetForm(): void {
    this.form = {
      expoId: this.expos.length > 0 ? this.expos[0].RID : null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      designation: '',
      city: '',
      state: '',
      purposeOfVisit: '',
    };
    this.profileImage = null;
    this.profileImagePreview = null;
    this.documents = [];
    this.selectedInterests = [];
    this.otherInterestSelected = false;
    this.otherInterestText = '';
    if (this.expos.length > 0) {
      this.selectedExpo = this.expos[0];
    }
  }
}
