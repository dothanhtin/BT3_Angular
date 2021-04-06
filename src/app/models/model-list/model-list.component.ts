import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig,MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { model } from 'src/app/model';
import { ModelService } from 'src/app/shared/model.service';
import { ModelComponent } from '../model/model.component';
import {  FileItem, FileUploader } from 'ng2-file-upload';

const uploadAPI = 'http://localhost:4000/api/upload';
@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  models: model[] = [];

    listData!: MatTableDataSource<any>;
    displayedColumns: string[] = ['code','name', 'birthday', 'email','address','image', 'actions'];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    searchKey!: string;
    public uploader: FileUploader = new FileUploader({ url: uploadAPI, itemAlias: 'file' });
  constructor(private service: ModelService,private dialog :MatDialog) { }

  ngOnInit(): void {
    this.service.getModels().subscribe(models => {
      models = this.models;
      this.listData = new MatTableDataSource(this.models);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
  });
  }

  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    let dialogRef =this.dialog.open(ModelComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
  });
  }
  src='http://localhost:4000/api/';
  onEdit(row: any) {
    console.log(row);
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(ModelComponent, dialogConfig);
}

onDelete(code: any){
    if(confirm('Are you sure to delete this record ?')){
        this.service.deleteModel(code);
    this.loadData();
    }
}
public loadData() {
  this.service.getModels()
      .subscribe(models => {
          this.models = models;
          this.listData = new MatTableDataSource(this.models);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
      });
    }
}
