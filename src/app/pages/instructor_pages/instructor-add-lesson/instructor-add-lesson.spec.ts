import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorAddLesson } from './instructor-add-lesson';

describe('InstructorAddLesson', () => {
  let component: InstructorAddLesson;
  let fixture: ComponentFixture<InstructorAddLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorAddLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorAddLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
