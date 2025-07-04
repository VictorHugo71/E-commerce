import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarMap: {[key: string]: string} = {
    'avatar01.png': 'Robô Vingador',
    'avatar02.png': 'Robô Destemido',
    'avatar03.png': 'Roboô Surpreso',
    'avatar04.png': 'Robô Guardião',
    'avatar05.png': 'Robõ Caçador',
    'avatar06.png': 'Robô Lâmpada'
  };

  getNomeLegal(nomeArquivo: string): string {
    return this.avatarMap[nomeArquivo] || nomeArquivo;
  }

  getTodosAvatares(): {arquivo: string, nome: string} [] {
    return Object.entries(this.avatarMap).map(([arquivo, nome]) => ({arquivo, nome}));
    
  }
  constructor() { }
}
