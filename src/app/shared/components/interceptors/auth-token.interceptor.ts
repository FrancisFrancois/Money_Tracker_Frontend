import { Injectable } from '@angular/core';

// Importe les classes nécessaires pour créer un intercepteur HTTP.
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

// Importe Observable de RxJS, utilisé pour gérer des opérations asynchrones et des flux de données.
import { Observable } from 'rxjs';

// Décore la classe avec @Injectable, indiquant qu'elle peut être injectée dans d'autres classes.
@Injectable()
// Définit la classe AuthTokenInterceptor qui implémente l'interface HttpInterceptor.
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor() {}

  // Méthode intercept qui est appelée pour chaque requête HTTP.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // Récupère le token d'authentification stocké localement.
    let token : string | null = localStorage.getItem("money-tracker-token");

    // Vérifie si le token existe et n'est pas vide.
    if(token && token != '')
    {
      // Clone la requête HTTP et ajoute le header d'autorisation avec le token.
      let requestClone = request.clone({setHeaders:{'Authorization' : `Bearer ${token}`}});
      // Passe la requête modifiée au prochain intercepteur dans la chaîne.
      return next.handle(requestClone);
    }
  
    // Si aucun token n'est trouvé, passe la requête originale au prochain intercepteur.
    return next.handle(request);
  }
}
