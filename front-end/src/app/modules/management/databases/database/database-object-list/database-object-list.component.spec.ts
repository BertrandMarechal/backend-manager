import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseObjectListComponent } from './database-object-list.component';

describe('DatabaseObjectListComponent', () => {
  let component: DatabaseObjectListComponent;
  let fixture: ComponentFixture<DatabaseObjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseObjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseObjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
