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
import { HomeComponent } from './modules/management/home/home.component';
import { RepositoriesComponent } from './modules/management/repositories/repositories.component';
import { SharedModule } from './modules/shared/shared.module';
import { DatabaseEffects } from './store/effects/database.effects';
import { databaseReducers } from './store/reducers/database.reducers';
import { ServerlessEffects } from './store/effects/serverless.effects';
import { serverlessReducers } from './store/reducers/serverless.reducers';
import { DatabaseService } from './services/database.service';
import { ServerlessService } from './services/serverless.service';

@NgModule({
  declarations: [
    AppComponent,
    ManagementComponent,
    SettingsComponent,
    SettingsEditComponent,
    HomeComponent,
    RepositoriesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreRouterConnectingModule,
    appRouting,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreModule.forFeature('management', managementeReducers),
    StoreModule.forFeature('databaseManagement', databaseReducers),
    StoreModule.forFeature('serverless', serverlessReducers),
    EffectsModule.forFeature([
      ManagementEffects,
      DatabaseEffects,
      ServerlessEffects
    ]),
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [LocalhostService, ManagementService, DatabaseService, ServerlessService],
  bootstrap: [AppComponent]
})
export class AppModule { }
