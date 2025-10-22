import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'
import { ruta } from './rutas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {


  private socket!: Socket

  constructor() {
    this.socket = io(ruta, {
      withCredentials: true  // permite el envío de cookies si las usas para auth
    });
  }

  registerAsStudent() {
    this.socket.emit('registerAsStudent');
  }

  registerAsAdmin() {
    this.socket.emit('registerAsAdmin');
  }

  listenNotification(type: 'admin' | 'student'): Observable<string> {
    const event = type === 'admin' ? 'adminNotification' : 'studentNotification';

    return new Observable<string>((subscriber) => {
      this.socket.on(event, (message: string) => {
        subscriber.next(message);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }




}
