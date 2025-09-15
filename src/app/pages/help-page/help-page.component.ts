import { Component, OnInit } from '@angular/core';
import { CommonService } from '@app/service/common.service';
import { HelpManualService } from '@app/service/help/help-manual.service';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.css'],
  standalone: false
})
export class HelpPageComponent implements OnInit {

  filepdf: string = '';
  isLoadFile: number = 1;

  constructor (private commonService: CommonService, private helpManualService: HelpManualService) {
    
  }

  ngOnInit() {
    this.commonService.showLoading();
    this.downloadManualFile();

    setTimeout(() => {
      this.isLoadFile = 2;
      this.commonService.hideLoading();
    }, 2000);
    setTimeout(() => {
      if (this.filepdf) 
        this.isLoadFile = 3;
    }, 2001);    
  }

  downloadManualFile() {
    this.helpManualService.downloadManual().subscribe((x: any) => {     
      console.log('FILE: ', x);   
      this.filepdf = window.URL.createObjectURL(x);            
    })
  }

}
