import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

import { NFC, Ndef } from '@ionic-native/nfc';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, private nfc: NFC, private ndef: Ndef) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  addNfcListeners():void {
        this.nfc.addTagDiscoveredListener((tagEvent:Event) => this.tagListenerSuccess(tagEvent));
        this.nfc.addNdefListener((tagEvent:Event) => this.tagListenerSuccess(tagEvent));
    }
  tagListenerSuccess(tagEvent:Event) {
       console.log(tagEvent);
       alert("succesfull read" + tagEvent);
   }

  // writeNfc(nfcEvent) {
  //   alert("fuck");
  //   this.nfc.addNdefListener(() => {
  //     alert('successfully attached ndef listener');
  //     let tag = nfcEvent.tag, ndefMessage = tag.ndefMessage;
      
  //           var message = this.nfc.bytesToString(ndefMessage[0].payload);
      
  //           alert(message);
  //   }, (err) => {
  //     alert('error attaching ndef listener'+ err);
  //   }).subscribe((event) => {
  //     alert('received ndef message. the tag contains: '+ event.tag);
  //     alert('decoded tag id'+ this.nfc.bytesToHexString(event.tag.id));
    
  //     /* let message = this.ndef.textRecord('Hello world'); */
  //     /* this.nfc.write([message]); */

      
  //   });
  // }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}
