import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PostsService } from '../services/post.service';

@Injectable()
export class PostsResolver implements Resolve<Post[]> {
  constructor(private postService: PostsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Post[] | Observable<Post[]> | Promise<Post[]> {
    return this.postService.getPost();
  }
}
