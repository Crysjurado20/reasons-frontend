import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiToast } from './ui-toast';

describe('UiToast', () => {
  let component: UiToast;
  let fixture: ComponentFixture<UiToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiToast],
    }).compileComponents();

    fixture = TestBed.createComponent(UiToast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
