import { Component, Output, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-user-finder",
  templateUrl: "./user-finder.component.html",
  styleUrls: ["./user-finder.component.scss"],
})
export class UserFinderComponent {
  @Output() name = new EventEmitter<string>();
  nameForm = new FormControl("");

  constructor() {
    this.nameForm.valueChanges.subscribe((value) => this.update(value));
  }

  update(value: string) {
    this.name.emit(this.nameForm.value);
  }
}
