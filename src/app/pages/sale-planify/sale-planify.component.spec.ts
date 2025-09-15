import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePlanifyComponent } from './sale-planify.component';

describe('SalePlanifyComponent', () => {
  let component: SalePlanifyComponent;
  let fixture: ComponentFixture<SalePlanifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalePlanifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePlanifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
