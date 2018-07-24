import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatabasesComponent } from './databases.component';
import { DatabaseComponent } from './database/database.component';
import { DatabaseParametersComponent } from './database/database-parameters/database-parameters.component';
import { DatabaseVersionComponent } from './database/database-version/database-version.component';
import { DatabaseParametersEditComponent } from './database/database-parameters-edit/database-parameters-edit.component';
import { DatabaseParametersNotSetPipe } from './database-parameters-not-set.pipe';
import { InstallDatabasesComponent } from './install-databases/install-databases.component';
import { DatabaseTableEditComponent } from './database/database-table-edit/database-table-edit.component';
import { DatabaseFunctionEditComponent } from './database/database-function-edit/database-function-edit.component';
import { DatabaseObjectListComponent } from './database/database-object-list/database-object-list.component';
import { DatabaseVersionInstalledComponent } from './database/database-version-installed/database-version-installed.component';
import { LogProgressComponent } from './install-databases/log-progress/log-progress.component';
import { SharedModule } from '../../shared/shared.module';
import { databasesRouting } from './databases.routing';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CommonModule } from '../../../../../node_modules/@angular/common';

@NgModule({
  declarations: [
    DatabasesComponent,
    DatabaseComponent,
    DatabaseParametersComponent,
    DatabaseParametersEditComponent,
    DatabaseVersionComponent,
    DatabaseParametersNotSetPipe,
    InstallDatabasesComponent,
    DatabaseTableEditComponent,
    DatabaseFunctionEditComponent,
    DatabaseObjectListComponent,
    DatabaseVersionInstalledComponent,
    LogProgressComponent,
  ],
  imports: [
    databasesRouting,
    CommonModule,
    FormsModule,
    SharedModule,
    SweetAlert2Module.forRoot(),
    // BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class DatabasesModule { }
