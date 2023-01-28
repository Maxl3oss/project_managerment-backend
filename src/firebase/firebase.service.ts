import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/dto/config.dto';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import {
  ref,
  getStorage,
  FirebaseStorage,
  StorageReference,
} from 'firebase/storage';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public fireStore: Firestore;
  public firebaseStorage: FirebaseStorage;

  // collections
  public usersCollection: CollectionReference;
  public productCollection: CollectionReference;
  // ref
  public storageRef: StorageReference;

  constructor(private configService: ConfigService<Config>) {
    this.app = initializeApp({
      apiKey: configService.get<string>('APIKEY'),
      authDomain: configService.get<string>('AUTHDOMAIN'),
      projectId: configService.get<string>('PROJECTID'),
      storageBucket: configService.get<string>('STORAGEBUCKET'),
      messagingSenderId: configService.get<string>('MESSAGINGSENDERID'),
      appId: configService.get<string>('APPID'),
    });

    this.auth = getAuth(this.app);
    this.fireStore = getFirestore(this.app);
    this.firebaseStorage = getStorage(this.app);

    this._createCollections();
    this._ref();
  }
  private _createCollections() {
    this.usersCollection = collection(this.fireStore, 'users');
    this.productCollection = collection(this.fireStore, 'products');
  }
  private _ref() {
    this.storageRef = ref(this.firebaseStorage).root;
  }
}
