import { Component, ElementRef, OnInit } from '@angular/core';
import { MenuService } from '@app/core/menu/menu.service';
import { SlideInOutAnimation } from './animation';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  animations:[SlideInOutAnimation]
})
export class SideBarComponent implements OnInit {
  settings:any={fixed:{sidebar:true}};
  public menuItems:any[] = [];
  constructor(private menu:MenuService) { }

  ngOnInit(): void {
    this.menu.onChange.subscribe(()=>{
      this.menuItems = this.menu.getMenu();
    })
  }
  isActive(item:any):boolean{
    return (item.active && item.submenu.length == 0)
  }
  isOpen(item:any):boolean{
    if(item.submenu.length > 0){
      return item.submenu.filter((x:any)=>x.active).length > 0 || item.submenu.filter((x:any)=>x.submenu.filter((y:any)=>y.active).length > 0).length > 0;
    }
    return false;
  }
  expand(item:any,e:any,sw:boolean = false){
    if(!sw) return;
    var isCompact = document.querySelectorAll('#sidebar.menu-compact').length > 0;
    var menuLink = e;
    if (!menuLink.classList.contains("menu-dropdown")) {
        if (isCompact && menuLink.get(0).parentNode.parentNode == this) {
            var menuText = menuLink.find(".menu-text").get(0);
            if (e.target != menuText && !menuText.includes(e.target)) {
                return false;
            }
        }
        return false;
    }
    var submenu = menuLink.nextSibling.nextSibling;
    if (submenu.offsetParent == null) {
        var c = submenu.parentNode.parentNode;
        if (isCompact && c.classList.contains("sidebar-menu")) return false;
          var elemets = c.querySelectorAll("* > .open > .submenu");
          for(var i = 0;i < elemets.length;i++){
            var e = elemets[i];
            if (e != submenu && !e.parentNode.classList.contains("active"))
                  e.parentNode.classList.remove("open");
          }
    }
    if (isCompact && submenu.parentNode.parentNode.classList.contains("sidebar-menu"))
        return false;
    if(submenu.parentNode.classList.contains('open')) e.parentNode.classList.remove("open");
    else submenu.parentNode.classList.add("open");
    //item.expand = 'in';
    return false;
  }
}
