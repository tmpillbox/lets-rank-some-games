import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from "@angular/common/http";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { GameListComponent } from "./game-list/game-list.component";
import { GameExportComponent } from "./game-export/game-export.component";
import { ToolBarComponent } from "./tool-bar/tool-bar.component";
import { RankedGamesService } from "./ranked-games.service";
import { ExportCSVDialogComponent } from "./top-bar/top-bar.component";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: "", component: GameListComponent },
      { path: "export", component: GameExportComponent }
    ]),
    DragDropModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    HelloComponent,
    GameListComponent,
    GameExportComponent,
    ToolBarComponent,
    ExportCSVDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  providers: [RankedGamesService]
})
export class AppModule {}
