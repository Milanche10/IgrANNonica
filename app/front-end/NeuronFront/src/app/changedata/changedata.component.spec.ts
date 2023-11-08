import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedataComponent } from './changedata.component';

describe('ChangedataComponent', () => {
  let component: ChangedataComponent;
  let fixture: ComponentFixture<ChangedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangedataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
