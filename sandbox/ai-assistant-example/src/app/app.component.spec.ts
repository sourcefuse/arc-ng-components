import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
      ],
      declarations: [AppComponent],
      providers:[MatDialog]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
