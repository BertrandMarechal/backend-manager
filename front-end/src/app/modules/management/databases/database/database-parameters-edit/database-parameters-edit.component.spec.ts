import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseParametersEditComponent } from './database-parameters-edit.component';

describe('DatabaseParametersEditComponent', () => {
  let component: DatabaseParametersEditComponent;
  let fixture: ComponentFixture<DatabaseParametersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseParametersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseParametersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
