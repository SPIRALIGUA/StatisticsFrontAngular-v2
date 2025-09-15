import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/service/common.service';
import { ConfirmService } from '@app/shared/shared-utils/message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {

  actualDate = new Date();
  public nombre_modulo: string = 'Estadistica';
  public weekday = this.actualDate.toLocaleString('es-Co', { weekday: 'long' }).charAt(0).toUpperCase() +
    this.actualDate.toLocaleString('es-Co', { weekday: 'long' }).slice(1).toLowerCase();

  constructor(
    public common: CommonService,
    private confirmService: ConfirmService
  ) {
    setInterval(() => {
      this.actualDate = new Date()
    }, 1000)
  }

  ngOnInit(): void {

  }

  mostrarAlerta() {
    this.common.showNotification('success', 'Mensaje', 'Error');
  }
  showAlert() {
    this.confirmService.message({
      title: 'Confirm deletion',
      message: 'Do you really want to delete this foo?',
      type_message: 'success',
    });
  }
}
