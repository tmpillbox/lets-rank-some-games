import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { HttpClientModule } from "@angular/common/http";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
//import { MatAutocompleteModule, MatInputModule } from "@angular/material";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { GameListComponent } from "./game-list/game-list.component";
import { GameExportComponent } from "./game-export/game-export.component";
import { ToolBarComponent } from "./tool-bar/tool-bar.component";
import { RankedGamesService } from "./ranked-games.service";

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
    MatInputModule
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    HelloComponent,
    GameListComponent,
    GameExportComponent,
    ToolBarComponent
  ],
  bootstrap: [AppComponent],
  providers: [RankedGamesService]
})
export class AppModule {}
