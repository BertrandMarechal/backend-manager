import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LambdaFunctionsComponent } from './lambda-functions.component';

describe('LambdaFunctionsComponent', () => {
  let component: LambdaFunctionsComponent;
  let fixture: ComponentFixture<LambdaFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LambdaFunctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LambdaFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
