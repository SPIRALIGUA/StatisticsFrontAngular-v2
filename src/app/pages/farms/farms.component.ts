import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { FarmsGraphqlService } from '@app/services/graphql/farms-graphql.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.css'],
  standalone: false
})
export class FarmsComponent implements OnInit {
  farmsList:any[] = [];
  dataSource:any = {}
  constructor(private farms:FarmsGraphqlService) { }

  ngOnInit(): void {
    this.dataSource = new CustomStore({
      key: "farm_id",
      load: (loadOptions: any) => {
        return lastValueFrom(this.farms.getFarms(true)).then(result => {
          if (result && result.data && result.totalCount !== undefined) {
            return {
              data: result.data,        
              totalCount: result.totalCount  
            };
          } else {
            return {
              data: [],
              totalCount: 0
            };
          }
        }).catch(error => {
          throw new Error('Error loading data');
        });
      }
    });
  }

  showAlert(farm:any){
    alert(farm.id);
  }
}
