import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableEditComponent } from './database-table-edit.component';

describe('DatabaseTableEditComponent', () => {
  let component: DatabaseTableEditComponent;
  let fixture: ComponentFixture<DatabaseTableEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseTableEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseTableEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
