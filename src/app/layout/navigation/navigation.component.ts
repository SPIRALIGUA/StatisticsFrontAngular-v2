import {  Component, OnInit, Output, ViewEncapsulation, EventEmitter,} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/login/auth.service';
import { MenuService } from '@app/core/menu/menu.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { User } from '@app/models/user';
import { CommonService } from '@app/service/common.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavigationComponent implements OnInit {
  @Output() enabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() options: EventEmitter<any> = new EventEmitter<any>();
  @Output() expanded: EventEmitter<boolean> = new EventEmitter<boolean>();
  usuario: any = new User();
  settings: any = { color: {}, fixed: {} };
  title = 'Estadistica';
  constructor(private setting: SettingsService,private menu:MenuService,private router:Router,private commun:CommonService) {}

  ngOnInit(): void {
    const user:User = this.setting.getUserSetting('');
    if(JSON.stringify(user) != '{}') this.usuario = user;
    this.setting.onUserChange.subscribe((x:User)=> {
      if(x.keylogin == '')
        this.usuario = new User();
      else
        this.usuario = x;
    })
  }
  logout(){
    this.setting.unsetUserSetting();
    this.menu.getMenu();
    window.location.href = environment.urlColibri;
  }
  onClicProfile(el:any) {
    let target = el.currentTarget;
    if (target.parentNode.classList.contains('open'))
      target.parentNode.classList.remove('open');
    else target.parentNode.classList.add('open');
  }
  onClickSetting(el:any) {
    let ele:any = document.querySelector('.navbar-account');
    if (ele.classList.contains('setting-open'))
      ele.classList.remove('setting-open');
    else ele.classList.add('setting-open');
  }

  onClickCollapseIcon(el:any) {
    let sidebar: any = document.querySelector('#sidebar');
    if (sidebar.offsetParent == null) {
      if (sidebar.classList.contains('hide')) sidebar.classList.remove('hide');
      else sidebar.classList.add('hide');
    }

    if (sidebar.classList.contains('menu-compact')) {
      this.expanded.emit(false);
      sidebar.classList.remove('menu-compact');
    } else {
      sidebar.classList.add('menu-compact');
      this.expanded.emit(true);
    }

    document.querySelectorAll('.sidebar-collapse').forEach((el) => {
      if (el.classList.contains('active')) el.classList.remove('active');
      else el.classList.add('active');
    });

    var isCompact = sidebar.classList.contains('menu-compact');

    if (sidebar.classList.contains('slimScrollDiv')) {
      this.enabled.emit(false);
    }
    if (isCompact) {
      document.querySelectorAll('.open > .submenu').forEach((el) => {
        el.classList.remove('open');
      });
    } else {
      if (sidebar.classList.contains('sidebar-fixed')) {
        var position =
          this.settings.rtl ||
          location.pathname == '/index-rtl-fa.html' ||
          location.pathname == '/index-rtl-ar.html'
            ? 'right'
            : 'left';
        this.options.emit({
          height: window.innerHeight - 90,
          position: position,
          size: '3px',
          color: this.settings.color.themeprimary,
        });
        this.enabled.emit(true);
      }
    }
  }
}
