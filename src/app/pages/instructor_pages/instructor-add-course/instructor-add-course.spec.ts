import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorAddCourse } from './instructor-add-course';

describe('InstructorAddCourse', () => {
  let component: InstructorAddCourse;
  let fixture: ComponentFixture<InstructorAddCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorAddCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorAddCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
