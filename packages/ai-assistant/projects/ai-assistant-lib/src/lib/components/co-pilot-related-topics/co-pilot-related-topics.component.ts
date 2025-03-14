import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {CoPilotRelatedTopics, LINK_ICON_PATH} from '../../constants';
import {LocalizationPipe} from '../../pipes/localization.pipe';

@Component({
  selector: CoPilotRelatedTopics,
  templateUrl: './co-pilot-related-topics.component.html',
  styleUrls: ['./co-pilot-related-topics.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [LocalizationPipe],
})
export class CoPilotRelatedTopicsComponent {
  @ViewChild('htmlMessage') htmlMessage: ElementRef<HTMLDivElement>;

  constructor() {}

  @Input('items')
  items: any;

  ngAfterViewInit() {
    if (!this._isJsonString(this.items)) {
      return false;
    }
    this.items = JSON.parse(this.items);
    const container =
      this.htmlMessage.nativeElement.getElementsByClassName(
        'related-topics',
      )?.[0];
    if (!container) {
      return false;
    }
    const fragment = document.createDocumentFragment();
    const downloadIconPath = LINK_ICON_PATH;
    for (const item of this.items) {
      const element = document.createElement('div');
      element.setAttribute('class', 'related-topic');
      element.setAttribute('id', item.link);
      element.addEventListener('click', event => {
        event.stopPropagation();
        // window.open(
        //   `${environment.copilotResourceTopicUrlPrefix}/${item.link}`,
        //   '_blank',
        // );
      });

      const iconElement = document.createElement('img');
      iconElement.setAttribute('class', 'related-topic-image');
      iconElement.setAttribute('src', downloadIconPath);
      element.appendChild(iconElement);

      const textElement = document.createElement('span');
      textElement.setAttribute('class', 'related-topic-text');
      textElement.textContent = item.name;
      element.appendChild(textElement);

      fragment.appendChild(element);
    }

    container.appendChild(fragment);
    return true;
  }

  ngOnDestroy(): void {
    const relatedTopicDivs =
      this.htmlMessage.nativeElement.getElementsByClassName(
        'related-topic',
      ) as unknown as any;
    if (!relatedTopicDivs) {
      return;
    }

    for (const element of relatedTopicDivs) {
      element.removeEventListener('click', event => {
        event.stopPropagation();
      });
    }
  }

  private _isJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
