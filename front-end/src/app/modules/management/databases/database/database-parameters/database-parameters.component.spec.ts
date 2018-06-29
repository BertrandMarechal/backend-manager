import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseParametersComponent } from './database-parameters.component';

describe('DatabaseParametersComponent', () => {
  let component: DatabaseParametersComponent;
  let fixture: ComponentFixture<DatabaseParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
