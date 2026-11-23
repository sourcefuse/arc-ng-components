import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotDownvoteComponent} from './co-pilot-downvote.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalizationPipe} from '../../pipes/localization.pipe';

describe('CoPilotDownvoteComponent', () => {
  let component: CoPilotDownvoteComponent;
  let fixture: ComponentFixture<CoPilotDownvoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotDownvoteComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        DragDropModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotDownvoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
