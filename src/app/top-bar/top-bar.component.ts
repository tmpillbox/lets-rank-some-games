import { Component, OnInit, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { RankedGamesService } from "../ranked-games.service";
import { MatFormField } from "@angular/material/form-field";
import { FormControl } from "@angular/forms";

export interface DialogData {
  exportCSVData: string;
}

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"],
  providers: [RankedGamesService]
})
export class TopBarComponent {
  constructor(
    public dialog: MatDialog,
    private rankedGames: RankedGamesService
  ) {}
  exportCSV(): void {
    const dialogRef = this.dialog.open(ExportCSVDialogComponent, {
      width: "500px",
      data: { exportCSVData: this.rankedGames.exportCSV() }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}

@Component({
  selector: "export-csv-dialog",
  templateUrl: "export-csv-dialog.html"
})
export class ExportCSVDialogComponent {
  exportCSVData: string;
  constructor(
    public dialogRef: MatDialogRef<ExportCSVDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.exportCSVData = data.exportCSVData;
  }

  clickOK(): void {
    this.dialogRef.close();
  }
}
