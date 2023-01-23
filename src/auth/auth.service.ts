import { JwtService } from '@nestjs/jwt';
import { User } from 'src/dto/user.dto';
import { FirebaseService } from './../firebase/firebase.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import {
  setDoc,
  DocumentReference,
  doc,
  DocumentSnapshot,
  DocumentData,
  getDoc,
} from 'firebase/firestore';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}

  public async login(email: string, password: string): Promise<any> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth,
        email,
        password,
      );
      if (userCredential) {
        const uid: string = userCredential.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseService.usersCollection,
          uid,
        );
        const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef);
        const loggedUser: User = {
          ...snapshot.data(),
          id: snapshot.id,
        } as User;

        delete loggedUser.password;

        const payload = {
          name: loggedUser.name,
          email: loggedUser.email,
          id: loggedUser.id,
        };

        // return loggedUser;
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    } catch (error) {
      const firebaseAuthError = error as AuthError;

      console.log(`[FIREBASE AUTH ERROR CODE] -> ${firebaseAuthError.code}`);

      if (firebaseAuthError.code === 'auth/wrong-password') {
        throw new HttpException(
          'Email or password incorrect.',
          HttpStatus.FORBIDDEN,
        );
      }

      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new HttpException('Email not found.', HttpStatus.NOT_FOUND);
      }
    }
  }

  public async register(body: Omit<User, 'id'>): Promise<void> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          this.firebaseService.auth,
          body.email,
          body.password,
        );
      if (userCredential) {
        const uid: string = userCredential.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseService.usersCollection,
          uid,
        );
        await setDoc(docRef, body);
      }
    } catch (error: unknown) {
      const firebaseAuthError = error as AuthError;
      console.log(`[FIREBASE AUTH ERROR CODE] -> ${firebaseAuthError.code}`);
      if (firebaseAuthError.code === 'auth/email-already-in-use') {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
    }
  }
}
