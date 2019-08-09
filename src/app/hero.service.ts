import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError,map,tap } from 'rxjs/operators';
import { Hero } from '../app/heroes/hero';
import { MessageService } from './message.service';
import { HttpClient,HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes'; 

  constructor(private messageService: MessageService,private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
   // this.messageService.add('HeroService: fetched heroes');
    //return of(HEROES);

    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    );

  }

  /** GET hero by id. will 404 if id not found. */
  getHero(id: number): Observable<Hero> {
  // TODO send the message __after__ fetching the hero
  const url =  `${this.heroesUrl}/${id}`;
  return this.http.get<Hero>(url).pipe(
    tap(_=> this.log(`fetched hero id=${id}`)),
    catchError(this.handleError<Hero>(`getHero id=${id}`))
  );
  // this.messageService.add(`HeroService: fetch hero id=${id}`);
  // return of(HEROES.find(hero =>hero.id === id));  
  }

/**PUT: update the hero on the server */
updateHero(hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl,hero,httpOptions).pipe(
    tap(_=> this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}

/** DELETE: delete the hero from the server */
deleteHero (hero: Hero| number): Observable<Hero> {
  const id = typeof hero === 'number' ? hero: hero.id;
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<Hero>(url,httpOptions).pipe(
    tap(_=>this.log(`delete hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  );
}

/** POST: add a new hero to the server */
addHero(hero: Hero): Observable<Hero>{
  return this.http.post<Hero>(this.heroesUrl,hero,httpOptions).pipe(
    tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<Hero>('addHero'))
  );
}

searchHeroes(term: string): Observable<Hero[]> {
  if(!term.trim()) {
    //if not search term, return empty hero array
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(_=> this.log(`found heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes',[]))
  );
};



  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation',result ? :T) {
    return (error:any): Observable<T> =>{
      
      //TODO: send the error to remote loggin infrastructure
      console.error(error);

      // TODO: better job of transoforming error for user consumption
      this.log(`${operation} failed : ${error.message}`);

      //let the app keep runnning by returing an empty result
      return of(result as T);
    }
      
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  } 

}//end of class
