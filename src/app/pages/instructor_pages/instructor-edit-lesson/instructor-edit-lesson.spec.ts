import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorEditLesson } from './instructor-edit-lesson';

describe('InstructorEditLesson', () => {
  let component: InstructorEditLesson;
  let fixture: ComponentFixture<InstructorEditLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorEditLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorEditLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
