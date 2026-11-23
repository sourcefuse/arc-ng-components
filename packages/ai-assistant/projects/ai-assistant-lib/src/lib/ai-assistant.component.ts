import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'lib-ai-assistant',
  template: ` <p>ai-assistant works!</p> `,
  styles: [],
})
export class AiAssistantComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
