import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  public isSingle : boolean = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  optionCtrl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedOptions: string[] = [];
  _setOptions : number = 0;
  @Input() selectedOption : string = '';

  @Input() selectType: string = '';
  @Input() title : string = '';
  @Input() options : any = [];
  @Input() disabled : boolean = false;
  @Input() previouslySelectedOption : string = '';
  @Input()
    set setOptions(value : number){
      this._setOptions = value;
      console.log('setting to value ', value);
      switch(value){
        case 1:
          this.options = ['mae','mse','rmse'];
          break;
        case 2:
          this.options = ['accuracy','auc'];
          break;
        default:
          break;
      }
    }
  @ViewChild('optionInput') optionInput: ElementRef<HTMLInputElement> | any;
  
  @Output() onSelectedEventSingle : EventEmitter<string> = new EventEmitter();
  @Output() onSelectedEventMulti : EventEmitter<string[]> = new EventEmitter();

  constructor() { 
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((option: string | null) => (option ? this._filter(option) : this.options.slice())),
    );
  }

  ngOnInit(): void {
    if(this.selectType === 'multi'){
      this.isSingle = false;
    }
  }
  
  selectedSingle(){
    this.onSelectedEventSingle.emit(this.selectedOption);
  }

  remove(option: string): void {
    const index = this.selectedOptions.indexOf(option);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedOptions.includes(event.option.viewValue.trim())) {
      this.selectedOptions.push(event.option.viewValue);
      this.onSelectedEventMulti.emit(this.selectedOptions);
    }
    this.optionInput.nativeElement.value = '';
    this.optionCtrl.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.selectedOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}
