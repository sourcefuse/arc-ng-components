import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotHeaderComponent} from './co-pilot-header.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalizationPipe} from '../../pipes/localization.pipe';

describe('CoPilotHeaderComponent', () => {
  let component: CoPilotHeaderComponent;
  let fixture: ComponentFixture<CoPilotHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DragDropModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
      ],
      declarations: [CoPilotHeaderComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeDialog event when onClose method is called', () => {
    spyOn(component.closeDialog, 'emit');

    component.onClose();

    expect(component.closeDialog.emit).toHaveBeenCalled();
  });

  it('should emit resetChatEmit event when resetChat method is called', () => {
    spyOn(component.resetChatEmit, 'emit');

    component.resetChat();

    expect(component.resetChatEmit.emit).toHaveBeenCalled();
  });

  it('should emit openHistoryComp event when openHistory method is called', () => {
    spyOn(component.openHistoryComp, 'emit');

    component.openHistory();

    expect(component.openHistoryComp.emit).toHaveBeenCalled();
  });

  it('should have cdk drag boundary to stay within constraints', () => {
    const containerElement: HTMLElement = fixture.nativeElement.querySelector(
      '.co-pilot-header-sub-header',
    );
    const boundary = containerElement.getAttribute('cdkDragBoundary');
    expect(boundary).toBe('.cdk-overlay-container');
  });
});
