import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOnEnvironmentPipe } from '../management/settings/filter-on-environment.pipe';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

@NgModule({
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot(),
  ],
  declarations: [
    FilterOnEnvironmentPipe,
  ],
  exports: [
    FilterOnEnvironmentPipe,
  ]
})
export class SharedModule { }
