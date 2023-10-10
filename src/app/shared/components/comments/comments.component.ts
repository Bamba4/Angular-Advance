import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/core/models/comment.model';
import { flashAnimation } from '../../animations/flash.animation';
import { SlideAndFade } from '../../animations/slide-and-fade.animation';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@listItem', [stagger(50, [animateChild()])]),
      ]),
    ]),
    trigger('listItem', [
      state(
        'default',
        style({
          transform: 'scale(1)',
          backgroundColor: 'white',
          zIndex: 1,
        })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.05)',
          backgroundColor: 'rgb(201, 157, 242)',
          zIndex: 2,
        })
      ),
      transition('default => active', [animate('100ms ease-in-out')]),
      transition('active => default', [animate('500ms ease-in-out')]),
      transition('void => *', [
        query('.comment-text, .comment-date', [
          style({
            opacity: 0,
          }),
        ]),
        useAnimation(SlideAndFade, {
          params: {
            time: '900ms',
            startColor: 'rgb(201, 157, 242)',
          },
        }),
        group([
          useAnimation(flashAnimation, {
            params: {
              time: '1000ms',
              flashColor: 'rgb(201, 157, 24)',
            },
          }),
          query('.comment-text', [
            animate(
              '250ms',
              style({
                opacity: 1,
              })
            ),
          ]),
          query('.comment-date', [
            animate(
              '900ms',
              style({
                opacity: 1,
              })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class CommentsComponent implements OnInit {
  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>();

  fullName = { firstName: 'Cheikh Ahmadou Bamba', lastName: 'Diagne' };

  commentCtrl!: FormControl;

  animationsStates: { [key: number]: 'default' | 'active' } = {};
  listItemAnimationsState: 'default' | 'active' = 'default';

  constructor(private formsBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.commentCtrl = this.formsBuilder.control('', [
      Validators.required,
      Validators.minLength(10),
    ]);

    for (let index in this.comments) {
      this.animationsStates[index] = 'default';
    }
  }

  onLeaveComment() {
    if (this.commentCtrl.invalid) {
      return;
    }

    const maxId = Math.max(
      ...this.comments.map((comment: Comment) => comment.id)
    );
    this.comments.unshift({
      id: maxId + 1,
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId: 1,
    });
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

  onListItemMouseEnter(index: number) {
    this.animationsStates[index] = 'active';
  }

  onListItemMouseLeave(index: number) {
    this.animationsStates[index] = 'default';
  }
}
