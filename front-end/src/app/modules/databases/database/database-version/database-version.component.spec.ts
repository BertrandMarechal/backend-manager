import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseVersionComponent } from './database-version.component';

describe('DatabaseVersionComponent', () => {
  let component: DatabaseVersionComponent;
  let fixture: ComponentFixture<DatabaseVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
