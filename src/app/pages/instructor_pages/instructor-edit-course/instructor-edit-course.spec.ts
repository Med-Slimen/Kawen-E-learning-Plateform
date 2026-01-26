import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorEditCourse } from './instructor-edit-course';

describe('InstructorEditCourse', () => {
  let component: InstructorEditCourse;
  let fixture: ComponentFixture<InstructorEditCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorEditCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorEditCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
