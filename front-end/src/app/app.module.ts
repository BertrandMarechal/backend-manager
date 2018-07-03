import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ManagementService } from './services/management.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { managementeReducers } from './store/reducers/management.reducers';
import { ManagementEffects } from './store/effects/management.effects';
import { ManagementComponent } from './modules/management/management.component';
import { SettingsComponent } from './modules/management/settings/settings.component';
import { LocalhostService } from './services/localhost.service';
import { HttpClientModule } from '@angular/common/http';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { appRouting } from './app.routing';
import { MaterialModule } from './modules/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsEditComponent } from './modules/management/settings-edit/settings-edit.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { HomeComponent } from './modules/management/home/home.component';
import { RepositoriesComponent } from './modules/management/repositories/repositories.component';
import { DatabasesComponent } from './modules/management/databases/databases.component';
import { DatabaseComponent } from './modules/management/databases/database/database.component';
import { DatabaseParametersComponent } from './modules/management/databases/database/database-parameters/database-parameters.component';
import { DatabaseVersionComponent } from './modules/management/databases/database/database-version/database-version.component';
import { DatabaseParametersEditComponent } from './modules/management/databases/database/database-parameters-edit/database-parameters-edit.component';
import { DatabaseParametersNotSetPipe } from './modules/management/databases/database-parameters-not-set.pipe';
import { InstallDatabasesComponent } from './modules/management/databases/install-databases/install-databases.component';
import { databaseReducers } from './store/reducers/database.reducers';
import { DatabaseEffects } from './store/effects/database.effects';
import { DatabaseService } from './services/database.service';
import { DatabaseTableEditComponent } from './modules/management/databases/database/database-table-edit/database-table-edit.component';
import { DatabaseFunctionEditComponent } from './modules/management/databases/database/database-function-edit/database-function-edit.component';
import { DatabaseObjectListComponent } from './modules/management/databases/database/database-object-list/database-object-list.component';
import { DatabaseVersionInstalledComponent } from './modules/management/databases/database/database-version-installed/database-version-installed.component';

@NgModule({
  declarations: [
    AppComponent,
    ManagementComponent,
    SettingsComponent,
    SettingsEditComponent,
    HomeComponent,
    RepositoriesComponent,
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
  ],
  imports: [
    BrowserModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreRouterConnectingModule,
    appRouting,
    StoreModule.forRoot(reducers),
    StoreModule.forFeature('management', managementeReducers),
    StoreModule.forFeature('databaseManagement', databaseReducers),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      ManagementEffects,
      DatabaseEffects
    ]),
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [LocalhostService, ManagementService, DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
