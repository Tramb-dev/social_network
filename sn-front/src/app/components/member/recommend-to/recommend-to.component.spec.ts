import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendToComponent } from './recommend-to.component';

describe('RecommendToComponent', () => {
  let component: RecommendToComponent;
  let fixture: ComponentFixture<RecommendToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
