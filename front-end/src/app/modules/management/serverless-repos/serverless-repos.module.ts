import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerlessRepoComponent } from './serverless-repo/serverless-repo.component';
import { ServerlessRepoParametersComponent } from './serverless-repo/serverless-repo-parameters/serverless-repo-parameters.component';
import { ServerlessReposComponent } from './serverless-repos.component';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { serverlessReposRouting } from './serverless-repos.routing';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    serverlessReposRouting,
  ],
  declarations: [ServerlessRepoComponent, ServerlessRepoParametersComponent, ServerlessReposComponent],
  exports: [ServerlessRepoComponent, ServerlessRepoParametersComponent, ServerlessReposComponent]
})
export class ServerlessReposModule { }
