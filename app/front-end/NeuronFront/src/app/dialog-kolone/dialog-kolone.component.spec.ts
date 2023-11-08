import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogKoloneComponent } from './dialog-kolone.component';

describe('DialogKoloneComponent', () => {
  let component: DialogKoloneComponent;
  let fixture: ComponentFixture<DialogKoloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogKoloneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogKoloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
