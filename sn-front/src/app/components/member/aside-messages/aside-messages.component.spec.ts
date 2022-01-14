import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideMessagesComponent } from './aside-messages.component';

describe('AsideMessagesComponent', () => {
  let component: AsideMessagesComponent;
  let fixture: ComponentFixture<AsideMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsideMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
