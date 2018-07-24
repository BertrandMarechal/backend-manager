import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerlessReposComponent } from './serverless-repos.component';

describe('ServerlessReposComponent', () => {
  let component: ServerlessReposComponent;
  let fixture: ComponentFixture<ServerlessReposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerlessReposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerlessReposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
