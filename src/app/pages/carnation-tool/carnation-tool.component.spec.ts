import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnationToolComponent } from './carnation-tool.component';

describe('CarnationToolComponent', () => {
  let component: CarnationToolComponent;
  let fixture: ComponentFixture<CarnationToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarnationToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarnationToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
