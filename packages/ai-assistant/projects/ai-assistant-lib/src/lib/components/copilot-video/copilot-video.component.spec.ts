import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CopilotVideoComponent} from './copilot-video.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {CoPilotVideoService, DeepChatCommsService} from '../../services';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalizationPipe} from '../../pipes/localization.pipe';

describe('CopilotVideoComponent', () => {
  let component: CopilotVideoComponent;
  let fixture: ComponentFixture<CopilotVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopilotVideoComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        DragDropModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
      ],
      providers: [DeepChatCommsService, CoPilotVideoService],
    }).compileComponents();

    fixture = TestBed.createComponent(CopilotVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not request "undefined" when no poster or video url is set', () => {
    const root: ShadowRoot = fixture.nativeElement.shadowRoot;

    expect(root.querySelector('video')?.getAttribute('poster')).toBe('');
    expect(root.querySelector('source')?.getAttribute('src')).toBe('');
  });

  it('should execute restoreScrollPosition on fullscreenchange', () => {
    const event = new Event('fullscreenchange', {bubbles: true});
    const element = component.videoElement.nativeElement;
    const restoreScrollPositionSpy = spyOn(component, 'restoreScrollPosition');
    element.dispatchEvent(event);
    expect(restoreScrollPositionSpy).toHaveBeenCalled();
  });
});
