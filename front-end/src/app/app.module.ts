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
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SettingsEditComponent } from './modules/management/settings-edit/settings-edit.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { HomeComponent } from './modules/management/home/home.component';
import { RepositoriesComponent } from './modules/management/repositories/repositories.component';
import { DatabasesComponent } from './modules/databases/databases.component';
import { DatabaseComponent } from './modules/databases/database/database.component';
import { DatabaseParametersComponent } from './modules/databases/database/database-parameters/database-parameters.component';
import { DatabaseParametersEditComponent } from './modules/databases/database/database-parameters-edit/database-parameters-edit.component';
import { DatabaseVersionComponent } from './modules/databases/database/database-version/database-version.component';

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
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      ManagementEffects
    ]),
    MaterialModule,
  ],
  providers: [LocalhostService, ManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
