import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderVerification } from './under-verification';

describe('UnderVerification', () => {
  let component: UnderVerification;
  let fixture: ComponentFixture<UnderVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
