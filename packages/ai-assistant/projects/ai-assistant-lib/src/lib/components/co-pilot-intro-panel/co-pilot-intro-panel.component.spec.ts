import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoPilotRoles} from '../../enums';
import {CoPilotIntroPanelComponent} from './co-pilot-intro-panel.component';
import {Integers} from '../../enums/numbers.enum';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalizationPipe} from '../../pipes/localization.pipe';

describe('CoPilotIntroPanelComponent', () => {
  let component: CoPilotIntroPanelComponent;
  let fixture: ComponentFixture<CoPilotIntroPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoPilotIntroPanelComponent, LocalizationPipe],
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

    fixture = TestBed.createComponent(CoPilotIntroPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit message when suggestion is clicked', () => {
    const suggestionContent = 'Test suggestion';
    const expectedMessage = {
      role: CoPilotRoles.USER,
      text: suggestionContent,
    };
    spyOn(component.sendMessage, 'emit');

    const mockEvent = {
      target: {
        textContent: suggestionContent,
      } as HTMLElement,
    } as unknown as MouseEvent;

    component.onSuggestionClick(mockEvent);

    expect(component.sendMessage.emit).toHaveBeenCalledWith(expectedMessage);
  });

  it('should initialize panels array with correct values', () => {
    expect(component.introQuestionPanels.length).toBe(Integers.Three);
    expect(component.introQuestionPanels[Integers.Zero].translationKey).toBe(
      'introPanelAIOne',
    );
  });

  it('should not emit message when target textContent is undefined', () => {
    spyOn(component.sendMessage, 'emit');

    const mockEvent = {
      target: {
        textContent: undefined,
      } as HTMLElement,
    } as unknown as MouseEvent;

    component.onSuggestionClick(mockEvent);

    expect(component.sendMessage.emit).not.toHaveBeenCalled();
  });
});
