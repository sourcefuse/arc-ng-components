import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import {LocalizationPipe} from '../../pipes/localization.pipe';
import {CoPilotHeader} from '../../constants';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: CoPilotHeader,
  templateUrl: './co-pilot-header.component.html',
  styleUrls: ['./co-pilot-header.component.scss'],
  providers: [LocalizationPipe],
})
export class CoPilotHeaderComponent {
  @Output() closeDialog = new EventEmitter();

  @Output() resetChatEmit = new EventEmitter();

  @Output() openHistoryComp = new EventEmitter();

  onClose() {
    this.closeDialog.emit();
  }

  openHistory() {
    this.openHistoryComp.emit();
  }

  resetChat() {
    this.resetChatEmit.emit();
  }

  onDragEnded($event) {
    sessionStorage.setItem('dragged', 'true');
  }
}
