import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NnControlsComponent } from './nn-controls.component';

describe('NnControlsComponent', () => {
  let component: NnControlsComponent;
  let fixture: ComponentFixture<NnControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NnControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NnControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
