import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerlessRepoParametersComponent } from './serverless-repo-parameters.component';

describe('ServerlessRepoParametersComponent', () => {
  let component: ServerlessRepoParametersComponent;
  let fixture: ComponentFixture<ServerlessRepoParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerlessRepoParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerlessRepoParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
