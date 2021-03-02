import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  text: string = "Text Goes Here";
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage = null;
  uploadUrl = 'http://localhost:4000/api/upload';
  screenshotUrl = 'http://localhost:4000/api/screenshot';
  public uploader: FileUploader = new FileUploader({
    url: this.uploadUrl,
    itemAlias: 'image'
  });
  image;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item, response, status, headers) => {
      if(response) {
        this.text = JSON.parse(response).message;
      }
    };
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      this.text = "Camera access was not allowed by user!"
    }
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.image = webcamImage.imageAsDataUrl;

    this.http.post<any>(this.screenshotUrl, {"base64": webcamImage.imageAsBase64})
    .subscribe( (text) => {
      this.text = text.message;
    });

  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  convertDataUrlToBlob(dataUrl): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }
}
