import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoTestingModule, TranslocoConfig } from '@ngneat/transloco';
import th from '../assets/i18n/th.json';

const getTranslocoModule = (config: Partial<TranslocoConfig> = {}) => {
  return TranslocoTestingModule.forRoot({
    langs: {
      th
    },
    translocoConfig: {
      availableLangs: ['th'],
      defaultLang: 'th',
      ...config
    }
  });
};

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, FontAwesomeModule, getTranslocoModule()],
        declarations: [AppComponent]
      }).compileComponents();
    })
  );
  it(
    'should create the app',
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
  it(
    `should have as collapse 'true'`,
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app.collapse).toEqual(true);
    })
  );
  it(
    `should render footer with text 'ANAN DAY'`,
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('footer a').textContent).toContain(
        'ANAN DAY'
      );
    })
  );
});
