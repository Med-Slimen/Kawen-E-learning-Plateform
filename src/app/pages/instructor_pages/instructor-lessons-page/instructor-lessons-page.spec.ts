import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorLessonsPage } from './instructor-lessons-page';

describe('InstructorLessonsPage', () => {
  let component: InstructorLessonsPage;
  let fixture: ComponentFixture<InstructorLessonsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorLessonsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorLessonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
