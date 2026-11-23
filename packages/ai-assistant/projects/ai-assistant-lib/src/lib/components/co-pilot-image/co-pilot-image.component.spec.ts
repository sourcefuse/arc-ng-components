import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import {CoPilotImageComponent} from './co-pilot-image.component';
import {ImageStoreService} from '../../services/image-store.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalizationPipe} from '../../pipes/localization.pipe';

describe('CoPilotImageComponent', () => {
  let component: CoPilotImageComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CoPilotImageComponent>>;

  let fixture: ComponentFixture<CoPilotImageComponent>;

  let imageStoreSvcSpy: jasmine.SpyObj<ImageStoreService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    imageStoreSvcSpy = jasmine.createSpyObj('ImageStoreService', [
      'updateImage',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CoPilotImageComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        DragDropModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: []},

        {provide: ImageStoreService, useValue: imageStoreSvcSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoPilotImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the loading shimmer on the first render when a file key is set', () => {
    const imageFixture = TestBed.createComponent(CoPilotImageComponent);
    imageFixture.componentRef.setInput('filekey', 'screens/settings.png');

    imageFixture.detectChanges();

    const shimmer: HTMLElement =
      imageFixture.nativeElement.shadowRoot.querySelector(
        '.co-pilot-image-shimmer',
      );
    expect(imageFixture.componentInstance.isImageLoading).toBeFalse();
    expect(shimmer.style.display).toBe('none');
    expect(() => imageFixture.checkNoChanges()).not.toThrow();
  });

  it('should set isImageLoading to false and call updateImage with correct parameters', () => {
    component.numquestion = '1';
    component.imagecounter = '10';
    component.filekey = 'sampleFileKey';
    component.safeUrl = 'http://example.com/image.png';
    component.imageLoaded();

    expect(component.isImageLoading).toBeFalse();

    expect(imageStoreSvcSpy.updateImage).toHaveBeenCalledWith(
      1,
      10,
      'sampleFileKey',
      'http://example.com/image.png',
    );
  });
});
