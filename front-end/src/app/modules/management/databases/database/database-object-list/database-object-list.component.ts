import { Component, OnInit, OnChanges, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-database-object-list',
  templateUrl: './database-object-list.component.html',
  styleUrls: ['./database-object-list.component.css']
})
export class DatabaseObjectListComponent implements OnInit, OnChanges {
  @Input() objectList: string[];
  @Output() objectSelected: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  private selectedId: number = null;

  constructor() { }

  ngOnInit() {
    console.log(this.objectList);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.objectList = changes['objectList'] ? changes['objectList'].currentValue : [];
    console.log(this.objectList);
  }

  onSelect(id: number) {
    this.selectedId = id;
  }

  onConfirm() {
    this.objectSelected.emit(this.objectList[this.selectedId]);
  }

  onCancel() {
    this.cancel.emit(null);
  }

}
