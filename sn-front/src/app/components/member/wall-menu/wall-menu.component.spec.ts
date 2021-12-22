import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallMenuComponent } from './wall-menu.component';

describe('WallMenuComponent', () => {
  let component: WallMenuComponent;
  let fixture: ComponentFixture<WallMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
