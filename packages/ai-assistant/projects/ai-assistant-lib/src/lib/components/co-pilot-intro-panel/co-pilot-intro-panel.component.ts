import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import {CoPilotRoles} from '../../enums';
import {LocalizationPipe} from '../../pipes/localization.pipe';
import {CoPilotIntroPanel} from '../../constants';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: CoPilotIntroPanel,
  templateUrl: './co-pilot-intro-panel.component.html',
  styleUrls: [
    './co-pilot-intro-panel.component.scss',
    '../../../assets/icons/icomoon/style.css',
  ],
  providers: [LocalizationPipe],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CoPilotIntroPanelComponent {
  @Output() sendMessage = new EventEmitter();

  @Input() pageLoading = true;

  introQuestionPanels = [
    {translationKey: 'introPanelAIOne'},
    {translationKey: 'introPanelAITwo'},
    {
      translationKey: 'introPanelAIThree',
    },
  ];

  constructor() {}

  onSuggestionClick(event: MouseEvent): void {
    const suggestionContent = (event.target as HTMLElement).textContent;
    if (suggestionContent) {
      this.sendMessage.emit({
        role: CoPilotRoles.USER,
        text: suggestionContent,
      });
    }
  }
}
