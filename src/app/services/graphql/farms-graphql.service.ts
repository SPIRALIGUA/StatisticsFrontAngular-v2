import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, of } from 'rxjs';

interface Farm {
  farm_id: number;
  name: string;
}

interface FarmsQueryResult {
  data: { farms: Farm[] };
  totalCount: number;
}

const GET_FARMS = gql`
  query GetFarms {
    farms {
      farm_id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class FarmsGraphqlService {

  constructor(private apollo: Apollo) { }

  getFarms(mock: boolean = false): Observable<FarmsQueryResult> {
    if (mock) {
        return of({ data: { farms: [{farm_id: 1, name: 'Mock Farm'}] }, totalCount: 1 });
    }
    return this.apollo.watchQuery<FarmsQueryResult>({ query: GET_FARMS }).valueChanges;
  }
}
