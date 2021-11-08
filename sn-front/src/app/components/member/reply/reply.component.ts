import { Component, OnInit } from "@angular/core";
import { MatFormFieldControl } from "@angular/material/form-field";

@Component({
  selector: "app-reply",
  templateUrl: "./reply.component.html",
  styleUrls: ["./reply.component.scss"],
})
export class ReplyComponent implements OnInit {
  constructor(private matFormField: MatFormFieldControl) {}

  ngOnInit(): void {}
}
