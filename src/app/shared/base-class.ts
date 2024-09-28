import { Subject } from "rxjs";
import { Directive, OnDestroy } from "@angular/core";

@Directive()
export abstract class BaseClass implements OnDestroy {
    

    protected stop$: Subject<boolean>;
    constructor() {
        this.stop$ = new Subject<boolean>();
        let f = this.ngOnDestroy;
        this.ngOnDestroy = () => {

            // without this I was getting an error if the subclass had
            // this.blah() in ngOnDestroy
            f.bind(this)();
            this.stop$.next(true);
            this.stop$.complete();
        };
    }
    /// placeholder of ngOnDestroy. no need to do super() call of extended class.
    ngOnDestroy() { }
}
