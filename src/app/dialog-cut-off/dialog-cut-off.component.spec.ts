import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCutOffComponent } from './dialog-cut-off.component';

describe('DialogCutOffComponent', () => {
  let component: DialogCutOffComponent;
  let fixture: ComponentFixture<DialogCutOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCutOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCutOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
