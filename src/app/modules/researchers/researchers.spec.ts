import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Researchers } from './researchers';

describe('Researchers', () => {
  let component: Researchers;
  let fixture: ComponentFixture<Researchers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Researchers],
    }).compileComponents();

    fixture = TestBed.createComponent(Researchers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
