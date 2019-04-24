import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'and-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  collapse = true;
  constructor(private translate: TranslateService, private title: Title) {
    translate.setDefaultLang('th');
    translate.use('th');
    translate.get('common.title').subscribe(s => {
      title.setTitle(s);
    });
  }

  toggle() {
    this.collapse = !this.collapse;
  }
}
