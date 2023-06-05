import { Component, OnInit } from '@angular/core';
import {CertificadoService} from '../../../services/certificado.service';
import Swal from 'sweetalert2';

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
  goodbye: string = '';
  representante: string = '';
  juntaVecinal: string = '';
  nameNeighbor: string = '';
  addressNeighbor: string = '';
  rutNeighbor: string = '';
  

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
    .then( message => {
      Swal.fire({
        icon: 'success',
        title: 'Descargado',
        text: 'Certificado descargado exitosamente',
      })
    })
    .catch(error => {
      let messageAlert;
      messageAlert = error.errorType === 0 ? messageAlert = error.messageError: messageAlert = error.messageError;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: messageAlert,
      });
    });
  
  }
  rutUser(): string{
    const accessToken = localStorage.getItem('access_token');
      let rut = '';
      if (accessToken) {
        const payload = accessToken.split('.')[1];
        const decodedPayload = atob(payload);
        const userData = JSON.parse(decodedPayload);
        rut = userData.rut_user;
        // console.log(userData.rut_user);
        return userData.rut_user;
        
      } else {
        console.log('No se encontró el token');
        return '';
      }
  };
  
  enviarCorreo(): void {
    this.certificadoService.sendEmail()
      .then( message => {
        Swal.fire({
          icon: 'success',
          title: 'Enviado',
          text: message.resp,
        })
      })
      .catch(error => {
        let messageAlert;
        messageAlert = error.errorType === 0 ? messageAlert = error.messageError: messageAlert = error.messageError;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: messageAlert,
        });
      });
  }
  ngOnInit() {
    
    this.certificadoService.getParagraph()
    .then((response: any) => {
      this.tittle = response.certified.title;
      this.header = response.certified.header;
      this.paragraph = response.certified.paragraph1;
      this.paragraphOne = response.certified.paragraph2;
      this.paragraphThree = response.certified.paragraph3;
      this.goodbye = response.certified.goodbye;
      this.representante = response.certified.representante;
      this.juntaVecinal = response.certified.juntaV;
      this.nameNeighbor = response.certified.nombreVecino;
      this.addressNeighbor = response.certified.direccionVecino;
      this.rutNeighbor = response.certified.rutVecino;
    })
    .catch(error => {
      // console.error('Error al obtener el párrafo:', error);
    });
    this.certificadoService.sendRut(this.rutUser());
    this.rutUser();
  }

}
