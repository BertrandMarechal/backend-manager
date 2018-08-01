import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CommonModule } from '@angular/common';
import { AwsComponent } from './aws.component';
import { LambdaFunctionsComponent } from './lambda-functions/lambda-functions.component';
import { S3Component } from './s3/s3.component';
import { awsRouting } from './aws.routing';

@NgModule({
  declarations: [
    AwsComponent,
    LambdaFunctionsComponent,
    S3Component,
  ],
  imports: [
    awsRouting,
    CommonModule,
    FormsModule,
    SharedModule,
    SweetAlert2Module.forRoot(),
    // BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class AwsModule { }
