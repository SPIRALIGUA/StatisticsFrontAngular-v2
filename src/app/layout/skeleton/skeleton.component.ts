import { Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SlimScrollEvent } from 'ngx-slimscroll';
import { SettingsService } from '@app/core/settings/settings.service';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SkeletonComponent implements OnInit {
  settings: any = { fixed: { sidebar: false } };
  scrollEvents: any;
  opts: any;
  externalCondition: any;
  expanded: any;
  urlskincss: any;
  constructor(public sanitizer: DomSanitizer, public setting: SettingsService) { }

  ngOnInit(): void {
    this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    let cssUrl = this.setting.getAppSetting('currentSkin');
    this.urlskincss = this.sanitizer.bypassSecurityTrustResourceUrl(cssUrl);

  }
  onSetExternalCondition(e: any) {
    this.externalCondition = e;
  }
  onSetOptions(e: any) {
    this.opts = e;
  }
  onExpanded(e: any) {
    this.expanded = e;
  }
  getSkinCss() {
    let cssUrl = this.setting.getAppSetting('currentSkin')
    return this.sanitizer.bypassSecurityTrustResourceUrl(cssUrl)
  }
}
