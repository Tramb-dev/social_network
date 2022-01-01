import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { RandomUser } from "src/app/interfaces/user";

@Component({
  selector: "app-recommend-to",
  templateUrl: "./recommend-to.component.html",
  styleUrls: ["./recommend-to.component.scss"],
})
export class RecommendToComponent {
  constructor(
    public dialogRef: MatDialogRef<RecommendToComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { friends: RandomUser[] }
  ) {}
}
