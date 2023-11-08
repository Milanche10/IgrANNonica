import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenetworkComponent } from './createnetwork.component';

describe('CreatenetworkComponent', () => {
  let component: CreatenetworkComponent;
  let fixture: ComponentFixture<CreatenetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatenetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatenetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
