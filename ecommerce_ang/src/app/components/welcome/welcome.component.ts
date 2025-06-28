import { Component } from '@angular/core';
import { URL } from 'node:url';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  produtos = [
    {
      nome: 'Fone Bluetooth',
      preco: 99.90,
      imagem: 'fone.jpg'
    },
    {
      nome: 'Smartwatch',
      preco: 149.90,
      imagem: '/assets/smartwatch.jpg'
    },
    {
      nome: 'Câmera de Segurança',
      preco: 199.90,
      imagem: '/assets/camera.jpg'
    },
    {
      nome: 'Notebook Dell',
      preco: 3599.00,
      imagem: '/assets/notebook.jpg'
    },
    {
      nome: 'Monitor Gamer 144Hz',
      preco: 1249.00,
      imagem: '/assets/monitor.jpg'
    },
    {
      nome: 'Mouse sem fio',
      preco: 79.90,
      imagem: '/assets/mouse.jpg'
    }
  ];

  categorias = [
    'Eletrônicos',
    'Moda',
    'Casa e Decoração',
    'Beleza',
    'Brinquedos',
    'Esporte e Lazer'
  ];
  

}
