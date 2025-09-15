import { Component } from '@angular/core';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css'],
  standalone: false
})
export class ErrorsComponent {
  error='';
  code='';
  message='';

  ngOnInit(): void {
    let body = document.querySelectorAll("body")[0] as HTMLElement;
    body.classList.remove('body-404');
    body.classList.remove('body-500');
    Object.assign(this,history.state.datos);
    if(history.state.datos == null){
      this.code='404';
      this.message='Ruta no encontrada'
    }
    if(this.code.startsWith("4")){
      body.classList.add('body-404');
    }else if(this.code.startsWith('5')){
      body.classList.add('body-500');
    }
  }
}
