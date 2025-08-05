import { Component } from '@angular/core';
import { JsonUploadService } from '../json-upload.service';

@Component({
  selector: 'app-json-upload',
  templateUrl: './json-upload.component.html',
  styleUrls: ['./json-upload.component.css']
})
export class JsonUploadComponent {
  selectedFile: File | null = null;
  uploadResult: any = null;
  isLoading = false;
  error: string = '';

  constructor(private jsonUploadService: JsonUploadService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
        this.selectedFile = file;
        this.error = '';
      } else {
        this.error = 'Please select a valid JSON file';
        this.selectedFile = null;
      }
    }
  }

  onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
        this.selectedFile = file;
        this.error = '';
      } else {
        this.error = 'Please select a valid JSON file';
        this.selectedFile = null;
      }
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.error = 'Please select a file first';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.uploadResult = null;

    this.jsonUploadService.uploadJsonFile(this.selectedFile).subscribe(
      (response) => {
        this.isLoading = false;
        this.uploadResult = response;
        this.selectedFile = null;
      },
      (error) => {
        this.isLoading = false;
        this.error = error.message || 'Upload failed';
        console.error('Upload error:', error);
      }
    );
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('URL copied to clipboard');
    });
  }

  resetForm(): void {
    this.selectedFile = null;
    this.uploadResult = null;
    this.error = '';
    this.isLoading = false;
  }
}