import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotRelatedTopicsComponent} from './co-pilot-related-topics.component';
import {By} from '@angular/platform-browser';
import {DeepChatCommsService} from '../../services';
import {Integers} from '../../enums/numbers.enum';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalizationPipe} from '../../pipes/localization.pipe';

describe('CoPilotRelatedTopicsComponent', () => {
  let component: CoPilotRelatedTopicsComponent;
  let fixture: ComponentFixture<CoPilotRelatedTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotRelatedTopicsComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        DragDropModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
      ],
      providers: [DeepChatCommsService],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotRelatedTopicsComponent);

    component = fixture.componentInstance;
    component.items =
      '[{"name":"recommend-1","link":"x"},{"name":"recommend-2","link":"y"}]';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have same length of related topics divs as get from response', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.query(By.css('.related-topics'))
      .nativeElement.childNodes;
    expect(elements.length).toEqual(Integers.Two);
  });
});
