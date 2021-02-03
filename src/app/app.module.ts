import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { GameListComponent } from "./game-list/game-list.component";
import { GameExportComponent } from "./game-export/game-export.component";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: "", component: GameListComponent },
      { path: "export", component: GameExportComponent }
    ]),
    DragDropModule
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    HelloComponent,
    GameListComponent,
    GameExportComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
