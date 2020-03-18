 import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { webService } from 'app/shared/services/webService';
@Component({
  selector: 'app-dialog-cut-off',
  templateUrl: './dialog-cut-off.component.html',
  styleUrls: ['./dialog-cut-off.component.scss']
})
export class DialogCutOffComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

}
