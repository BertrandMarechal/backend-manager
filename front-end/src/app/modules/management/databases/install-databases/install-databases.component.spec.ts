import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallDatabasesComponent } from './install-databases.component';

describe('InstallDatabasesComponent', () => {
  let component: InstallDatabasesComponent;
  let fixture: ComponentFixture<InstallDatabasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallDatabasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallDatabasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
