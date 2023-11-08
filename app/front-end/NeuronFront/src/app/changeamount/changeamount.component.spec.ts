import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeamountComponent } from './changeamount.component';

describe('ChangeamountComponent', () => {
  let component: ChangeamountComponent;
  let fixture: ComponentFixture<ChangeamountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeamountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeamountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
