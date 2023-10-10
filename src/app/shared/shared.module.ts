import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { CommentsComponent } from './components/comments/comments.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortenPipe } from './pipes/shorten.pipe';
import { FullNamePipe } from './pipes/fullName.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { HoverCandidateDirective } from './directives/hover-candidate.directive';

@NgModule({
  declarations: [
    CommentsComponent,
    ShortenPipe,
    FullNamePipe,
    TimeAgoPipe,
    HighlightDirective,
    HoverCandidateDirective,
  ],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [
    CommentsComponent,
    MaterialModule,
    ReactiveFormsModule,
    ShortenPipe,
    TimeAgoPipe,
    HighlightDirective,
    HoverCandidateDirective,
  ],
})
export class SharedModule {}
