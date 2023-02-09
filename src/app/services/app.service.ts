import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { MoviesList } from '../interfaces/movies-list';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class AppService {
  private httpOptionsToken = {};

  public token$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  private listOfMovies$: BehaviorSubject<MoviesList[]> = new BehaviorSubject<
    MoviesList[]
  >([]);

  constructor(private http: HttpClient) {}

  public getListOfMovies(): MoviesList[] {
    return this.listOfMovies$.value;
  }
  public emptyListOfMovies(): void {
    this.listOfMovies$.next([]);
  }

  public releaseToken(): void {
    this.token$.next(null);
  }

  public callApi(usernameInput: string, passwordInput: string): Promise<any> {
    let promise = new Promise<void>(() => {
      let optionType: any = httpOptions;
      let jsonInput: any = {
        username: usernameInput,
        password: passwordInput,
      };

      return lastValueFrom(
        this.http
          .post('http://localhost:3000/auth/login', jsonInput, optionType)
          .pipe(
            map((data: any) => {
              if (
                data.token !== undefined &&
                data.token !== null &&
                data.token !== ''
              ) {
                this.token$.next(data.token);
              }
            })
          )
      );
    });
    return promise;
  }

  public getMovies(movieName?: string, sort?: string): Promise<any> {
    const listOfMovies: MoviesList[] = [];

    let promise = new Promise<void>((resolve, reject) => {
      if (movieName == undefined) {
        movieName = '';
      }
      if (sort == undefined) {
        sort = '';
      }

      this.httpOptionsToken = {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.token$.value}`
        ),
        params: new HttpParams()
          .append('query', movieName!)
          .append('sortBy', sort!),
      };

      let optionType: any = this.httpOptionsToken;
      return lastValueFrom(
        this.http.get('http://localhost:3000/movies', optionType).pipe(
          map(
            (res: any) => {
              res!.forEach((data: any) => {
                listOfMovies.push({
                  id: data.id,
                  title: data['Title'],
                  usGross: data['US Gross'],
                  usDvdSales: data['US DVD Sales'],
                  worldWideGross: data['Worldwide Gross'],
                  productionBudget: data['Production Budget'],
                  releaseDate: data['Release Date'],
                  distributor: data['Distributor'],
                  imdbRating: data['IMDB Rating'],
                  imdbVotes: data['IMDB Votes'],
                  majorGenre: data['Major Genre'],
                  director: data['Director'],
                  rottenTomatoesRating: data['Rotten Tomatoes Rating'],
                  mpaaRating: data['MPAA Rating'],
                  source: data['Source'],
                  runningTimeMin: data['Running Time min'],
                  creativeType: data['Creative Type'],
                  sort: sort!,
                  sortValue: data[sort!],
                });
              });
              this.listOfMovies$.next(listOfMovies);

              resolve();
            },
            (msg: string) => {
              reject(msg);
            }
          )
        )
      );
    });
    return promise;
  }

  public getMoviesById(id?: string): Promise<any> {
    const listOfMovies: MoviesList[] = [];

    let promise = new Promise<void>((resolve, reject) => {
      if (id == undefined) {
        id = '';
      }

      this.httpOptionsToken = {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.token$.value}`
        ),
      };

      let optionType: any = this.httpOptionsToken;

      return lastValueFrom(
        this.http.get('http://localhost:3000/movies/' + id, optionType).pipe(
          map(
            (res: any) => {
              listOfMovies.push({
                id: res.id,
                title: res['Title'],
                usGross: res['US Gross'],
                usDvdSales: res['US DVD Sales'],
                worldWideGross: res['Worldwide Gross'],
                productionBudget: res['Production Budget'],
                releaseDate: res['Release Date'],
                distributor: res['Distributor'],
                imdbRating: res['IMDB Rating'],
                imdbVotes: res['IMDB Votes'],
                majorGenre: res['Major Genre'],
                director: res['Director'],
                rottenTomatoesRating: res['Rotten Tomatoes Rating'],
                mpaaRating: res['MPAA Rating'],
                source: res['Source'],
                runningTimeMin: res['Running Time min'],
                creativeType: res['Creative Type'],
                sort: '',
                sortValue: '',
              });
              this.listOfMovies$.next(listOfMovies);
              resolve();
            },
            (msg: string) => {
              reject(msg);
            }
          )
        )
      );
    });
    return promise;
  }
}
