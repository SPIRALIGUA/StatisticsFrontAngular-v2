import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../core/menu/menu.service';
import { SettingsService } from '../../core/settings/settings.service';

@Directive({
  selector: '[appHeaderTitle]',
  standalone: true
})
export class HeaderTitleDirective {
  constructor(
    private el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const currentRoute = this.route.root.firstChild;
      if (currentRoute) {
        const menu = this.menuService.getMenu(); // This is a mock
        // Logic to find the title from the menu based on the route
        // For now, just set a default title
        this.el.nativeElement.innerText = 'Dashboard';
      }
    });
  }
}

@Directive({
  selector: '[appSkinChanger]',
  standalone: true
})
export class SkinChangerDirective {
  @Input() appSkinChanger: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2, private settingsService: SettingsService) {}

  ngOnInit() {
    // Logic to change skin based on settings
  }
}
