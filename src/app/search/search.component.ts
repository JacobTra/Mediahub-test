import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MoviesList } from '../interfaces/movies-list';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  public searchNametab: boolean = true;
  public displayInfos: boolean = false;
  public infosMovie: MoviesList = {};

  public form: FormGroup = this.fb.group({});
  public formId: FormGroup = this.fb.group({});

  public listOfMovies$ = new BehaviorSubject<MoviesList[]>([]);

  constructor(private appServices: AppService, private fb: FormBuilder) {}

  ngOnDestroy(): void {
    this.appServices.releaseToken();
    this.appServices.emptyListOfMovies();
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      movieName: [''],
      movieSort: [''],
    });
    this.formId = this.fb.group({
      movieId: [''],
    });
  }

  public tabClick(): void {
    this.searchNametab = !this.searchNametab;
  }

  public searchName(): void {
    this.appServices
      .getMovies(
        this.form.get('movieName')?.value,
        this.form.get('movieSort')?.value
      )
      .then(() => {
        this.listOfMovies$.next(this.appServices.getListOfMovies());
      });
  }

  public searchId(): void {
    this.appServices
      .getMoviesById(this.formId.get('movieId')?.value)
      .then(() => {
        this.listOfMovies$.next(this.appServices.getListOfMovies());
        this.setMovieInfos(this.listOfMovies$.value[0]);
      });
  }

  public setMovieInfos(movie: MoviesList): void {
    this.infosMovie = movie;
    if (Object.keys(this.infosMovie).length > 0) {
      this.displayInfos = true;
    } else {
      this.displayInfos = false;
    }
  }

  public logOut(): void {
    this.ngOnDestroy();
  }
}
