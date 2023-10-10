import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class CandidateService {
  lastCandidateLoaded = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _candidates$ = new BehaviorSubject<Candidate[]>([]);

  constructor(private http: HttpClient) {}

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getCandidatesFromServer() {
    if (Date.now() - this.lastCandidateLoaded <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    return this.http
      .get<Candidate[]>(`${environment.apiUrl}/candidates`)
      .pipe(
        tap((candidate) => {
          this.lastCandidateLoaded = Date.now();
          this._candidates$.next(candidate);
          this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  getCandidateById(id: number): Observable<Candidate> {
    if (!this.lastCandidateLoaded) {
      this.getCandidatesFromServer();
    }
    return this.candidates$.pipe(
      map(
        (candidates) => candidates.filter((candidate) => candidate.id === id)[0]
      )
    );
  }

  refuseCandidates(id: number): void {
    this.setLoadingStatus(true);
    this.http
      .delete(`${environment.apiUrl}/candidates/${id}`)
      .pipe(
        switchMap(() => this.candidates$),
        take(1),
        map((candidates) =>
          candidates.filter((candidate) => candidate.id !== id)
        ),
        tap((candidates) => {
          this._candidates$.next(candidates);
          this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  hireCandidate(id: number) {
    this.candidates$
      .pipe(
        take(1),
        map((candidates) =>
          candidates.map((candidate) =>
            candidate.id === id
              ? { ...candidate, company: 'Snapface LTD' }
              : candidate
          )
        ),
        tap((updatedCandidates) => this._candidates$.next(updatedCandidates)),
        switchMap((updatedCandidates) =>
          this.http.patch(
            `${environment.apiUrl}/candidates/${id}`,
            updatedCandidates.find((candidate) => candidate.id === id)
          )
        )
      )
      .subscribe();
  }
}
