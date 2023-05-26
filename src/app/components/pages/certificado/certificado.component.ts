import { Component, OnInit } from '@angular/core';
import {CertificadoService} from '../../../services/certificado.service';

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.css']
})

export class CertificadoComponent implements OnInit {
  
  tittle: string = '';
  header: string = '';
  paragraph: string = '';
  paragraphOne: string = '';
  paragraphThree: string = '';

  public listItems: string[] = [
    '[Nombre del representante de la Junta Vecinal]',
    'Junta Vecinal Villa Puente Alto',
  ];
  
  constructor(private certificadoService: CertificadoService) { }
  /**método que actualiza el título del certificado tanto en el frontend como en el backend. */
  updateCardTitle(title: string) {
    const defaultTitle = 'Debes seleccionar un tipo de certificado';
    const updatedTitle = title ?? defaultTitle;
    const cardTitleElement = document.querySelector('.sub-title');

    if (cardTitleElement) {
        cardTitleElement.textContent = updatedTitle;
        const payload = {
          subtitle: cardTitleElement.textContent
        };
        this.certificadoService.updateSubtitle(payload)
        .then((message) => {
          // console.log(message, 'Certificado actualizado con éxito');
        })
        .catch((error) => {
          console.error(error,'Error al actualizar el certificado');
        });
    }

  }
  /**se captura el valor retornado por la promesa del service. */
  downloadPDF(): void {
    this.certificadoService.downloadPDF()
    .then(() => {
      // console.log('pdf descargado exitosamente');
    })
    .catch(error => {
      console.log(error);
    });
  
  }
    
  ngOnInit() {
    this.certificadoService.getParagraph()
    .then((response: any) => {
      this.tittle = response.certified.title;
      this.header = response.certified.header;
      this.paragraph = response.certified.paragraph1;
      this.paragraphOne = response.certified.paragraph2
      this.paragraphThree = response.certified.paragraph3
    })
    .catch(error => {
      // console.error('Error al obtener el párrafo:', error);
    });
  }

}
