import { Component, OnInit, Input } from '@angular/core';
import { webService } from 'app/shared/services/webService';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {
  @Input('items') public menuItems: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;

  constructor(private service :webService) {}
  ngOnInit() {this.getAlarm();}
  alarmList:any;
  staticDataToRun = {
    userName: 'adani',
    password: 'adani',
    parentId: '5e3138c378d749.69075482'
  }
getAlarm(){
  this.service.alarmGet().subscribe(res=>{
      this.alarmList = res['resource']
    console.log(JSON.stringify(this.alarmList))
  })
}
  // Only for demo purpose
  addMenuItem() {
    this.menuItems.push({
      name: 'ITEM',
      type: 'dropDown',
      tooltip: 'Item',
      icon: 'done',
      state: 'material',
      sub: [
        {name: 'SUBITEM', state: 'cards'},
        {name: 'SUBITEM', state: 'buttons'}
      ]
    });
  }
}