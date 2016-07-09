import {Component} from '@angular/core';

import {ROUTER_DIRECTIVES} from '@angular/router';
import {FooterComponent} from '../footer/footer.component';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
    selector: 'main-app',
    directives: [ROUTER_DIRECTIVES, FooterComponent, NavbarComponent],
    templateUrl: 'components/app/app.component.html'
})
export class AppComponent{}
