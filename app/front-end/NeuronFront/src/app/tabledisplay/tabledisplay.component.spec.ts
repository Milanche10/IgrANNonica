import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabledisplayComponent } from './tabledisplay.component';

describe('TabledisplayComponent', () => {
  let component: TabledisplayComponent;
  let fixture: ComponentFixture<TabledisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabledisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabledisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
