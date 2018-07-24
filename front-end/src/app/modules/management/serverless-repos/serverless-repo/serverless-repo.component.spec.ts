import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerlessRepoComponent } from './serverless-repo.component';

describe('ServerlessRepoComponent', () => {
  let component: ServerlessRepoComponent;
  let fixture: ComponentFixture<ServerlessRepoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerlessRepoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerlessRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
