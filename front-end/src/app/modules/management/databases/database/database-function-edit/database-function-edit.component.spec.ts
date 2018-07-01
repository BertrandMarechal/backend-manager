import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseFunctionEditComponent } from './database-function-edit.component';

describe('DatabaseFunctionEditComponent', () => {
  let component: DatabaseFunctionEditComponent;
  let fixture: ComponentFixture<DatabaseFunctionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseFunctionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseFunctionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
