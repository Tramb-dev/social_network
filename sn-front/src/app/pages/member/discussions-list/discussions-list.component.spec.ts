import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionsListComponent } from './discussions-list.component';

describe('DiscussionsListComponent', () => {
  let component: DiscussionsListComponent;
  let fixture: ComponentFixture<DiscussionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
