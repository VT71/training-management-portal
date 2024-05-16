import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth, getAuth } from '@angular/fire/auth'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'

const firebaseConfig = {
  apiKey: "AIzaSyBTAjOzOAqm_7ogl0k8F-hMIo-eM76--vU",
  authDomain: "training-management-port-8a4b6.firebaseapp.com",
  projectId: "training-management-port-8a4b6",
  storageBucket: "training-management-port-8a4b6.appspot.com",
  messagingSenderId: "1013225321299",
  appId: "1:1013225321299:web:206cfdd9455dd36473a7a6",
  measurementId: "G-53PMMH3PDT"
};


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync('noop'),
    // importProvidersFrom([provideFirebaseApp(() => initializeApp(firebaseConfig)),
    //   provideAuth(() => getAuth()),
    // ]),

  ],
    

};
