import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-modal-dialog',
  templateUrl: './pdf-modal-dialog.component.html'
})
export class PdfModalDialogComponent {
  public trustedDashboardUrl: SafeUrl | null;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public matDialogData: any,
    private domSanitizer: DomSanitizer
  ) {
    this.setPdfUrl(this.matDialogData.linkToPdf);
  }
  private setPdfUrl(pdfUrl: string): void {
    this.trustedDashboardUrl = pdfUrl ? this.domSanitizer.bypassSecurityTrustResourceUrl(pdfUrl) : null;
  }
}
