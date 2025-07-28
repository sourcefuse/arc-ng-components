import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class DownloadService {
  constructor(private readonly sanitizer: DomSanitizer) {}

  downloadByBlob(blob: Blob, filename?: string, fileExt?: string): void {
    if (filename && fileExt) {
      filename += `.${fileExt}`;
    }
    const fileUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = fileUrl;
    anchor.click();
    window.URL.revokeObjectURL(fileUrl);
    anchor.remove();
  }

  toBase64(blob: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return fromEvent(reader, 'load').pipe(
      map(() => (reader.result as string).split(',')[1]),
    );
  }

  toSafeUrl(blob: Blob) {
    // sonarignore:start
    return this.toBase64(blob).pipe(
      map(base64 =>
        this.sanitizer.bypassSecurityTrustUrl(
          //NOSONAR
          `data:${blob.type};base64,${base64}`,
        ),
      ),
    );
    // sonarignore:end
  }
}
