import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewInstructor } from './review-instructor';

describe('ReviewInstructor', () => {
  let component: ReviewInstructor;
  let fixture: ComponentFixture<ReviewInstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewInstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewInstructor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
