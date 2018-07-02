import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseVersionInstalledComponent } from './database-version-installed.component';

describe('DatabaseVersionInstalledComponent', () => {
  let component: DatabaseVersionInstalledComponent;
  let fixture: ComponentFixture<DatabaseVersionInstalledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseVersionInstalledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseVersionInstalledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
