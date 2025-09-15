import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css']
})
export class ProgressbarComponent implements OnInit {
  max = 200;
  showWarning = false;
  dynamic:any;
  type:any;
  stacked:any;
  random() {
      var value = Math.floor((Math.random() * 100) + 1);
      var type;
      if (value < 25) {
          type = 'success';
      } else if (value < 50) {
          type = 'info';
      } else if (value < 75) {
          type = 'warning';
      } else {
          type = 'danger';
      }
      this.showWarning = (type === 'danger' || type === 'warning');
      this.dynamic = value;
      this.type = type;
  }


  randomStacked() {
      this.stacked = [];
      var types = ['success', 'info', 'warning', 'danger'];

      for (var i = 0, n = Math.floor((Math.random() * 4) + 1) ; i < n; i++) {
          var index = Math.floor((Math.random() * 4));
          this.stacked.push({
              value: Math.floor((Math.random() * 30) + 1),
              type: types[index]
          });
      }
  };
  constructor() { }

  ngOnInit(): void {
    this.random();
    this.randomStacked();
  }
}
