import {BehaviorSubject} from "rxjs";


export class LoaderService {
    loaderState$;
    constructor() {
        this.loaderState$ = new BehaviorSubject(null);
    }

    setLoaderState(state) {
        this.loaderState$.next(state);
    }

}


