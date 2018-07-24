import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DatabaseFile } from '../../../../../models/database.model';

@Component({
  selector: 'app-database-version-installed',
  templateUrl: './database-version-installed.component.html',
  styleUrls: ['./database-version-installed.component.css']
})
export class DatabaseVersionInstalledComponent implements OnInit, OnChanges {
  @Input() databases: DatabaseFile[];
  @Output() databaseSelected: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  selectedId: number = null;
  currentVersion: string;
  databaseVersions: { version: string, signification: string }[] = [];

  constructor() { }

  ngOnInit() {
    this.generateDatabaseVersions();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.databases = changes['databases'] ? changes['databases'].currentValue : [];
    this.generateDatabaseVersions();
  }

  private generateDatabaseVersions() {
    this.databaseVersions = [];
    console.log(this.databases);

    let versions = this.databases.map(x => x.version.split('-')[0]);
    versions = versions.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      }
      return 0;
    }).filter(x => x !== 'current');
    this.currentVersion = versions[versions.length - 1];
    const lastVersionSplit = versions[versions.length - 1].split('.').map(x => +x);
    console.log(versions);
    this.databaseVersions = [
      {
        version: [lastVersionSplit[0], lastVersionSplit[1], lastVersionSplit[2], lastVersionSplit[3] + 1].join('.'),
        signification: 'Minor patch release'
      },
      {
        version: [lastVersionSplit[0], lastVersionSplit[1], lastVersionSplit[2] + 1, 0].join('.'),
        signification: 'Patch'
      },
      {
        version: [lastVersionSplit[0], lastVersionSplit[1] + 1, 0, 0].join('.'),
        signification: 'Minor release (backwards compatible)'
      },
      {
        version: [lastVersionSplit[0] + 1, 0, 0, 0].join('.'),
        signification: 'Major version (NON backwards compatible)'
      },
    ];
  }

  onSelect(id: number) {
    this.selectedId = id;
  }

  onConfirm() {
    this.databaseSelected.emit(this.databaseVersions[this.selectedId].version);
  }

  onCancel() {
    this.cancel.emit(null);
  }
}
