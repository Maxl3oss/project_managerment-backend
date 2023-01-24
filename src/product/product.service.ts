import { FirebaseService } from 'src/firebase/firebase.service';
import {
  addDoc,
  updateDoc,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
  getDoc,
  getDocs,
  query,
  limit,
  where,
  orderBy,
  startAfter,
  endBefore,
  doc,
  Query,
} from 'firebase/firestore';
import { Product } from './../dto/product.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthError } from 'firebase/auth';

@Injectable()
export class ProductService {
  constructor(private firebaseService: FirebaseService) {}
  private limitItem = 2;
  private totalPage: number;
  private page = 1;
  private lastVisibleCitySnapShot = {};

  async addProduct(product: Omit<Product, 'id'>): Promise<any> {
    try {
      const docRef = await addDoc(
        this.firebaseService.productCollection,
        product,
      );

      return docRef.id;
    } catch (error: unknown) {
      const firebaseAuthError = error as AuthError;
      console.log(`[ADD PRODUCTS] -> ${firebaseAuthError.code}`);
      if (firebaseAuthError.code === 'auth/email-already-in-use') {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
    }
  }

  async updateProduct(pid: string, product: Omit<Product, 'id'>): Promise<any> {
    try {
      const docRef = await updateDoc(
        doc(this.firebaseService.productCollection, pid),
        product,
      );
      return docRef;
    } catch (error: unknown) {
      const firebaseAuthError = error as AuthError;
      console.log(`[UPDATE PRODUCTS] -> ${firebaseAuthError.code}`);
      if (firebaseAuthError.code === 'auth/email-already-in-use') {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
    }
  }

  async findAll(): Promise<Product[]> {
    this.page = 1;
    const sql = query(
      this.firebaseService.productCollection,
      orderBy('name'),
      limit(this.limitItem),
    );
    return this.fetchProduct(sql);
  }

  async next(): Promise<Product[]> {
    this.page += 1;
    const sql = query(
      this.firebaseService.productCollection,
      orderBy('name'),
      startAfter(this.lastVisibleCitySnapShot),
      limit(this.limitItem),
    );
    return this.fetchProduct(sql);
  }

  async prev(): Promise<Product[]> {
    this.page == 1 ? this.page : (this.page -= 1);
    const sql = query(
      this.firebaseService.productCollection,
      orderBy('name'),
      endBefore(this.lastVisibleCitySnapShot),
      limit(this.limitItem),
    );
    return this.fetchProduct(sql);
  }

  async findByPage(page: string): Promise<Product[]> {
    this.page = Number(page);
    const q = query(this.firebaseService.productCollection, orderBy('name'));
    const get = await getDocs(q);
    this.totalPage = Math.ceil(get.docs.length / this.limitItem);

    if (page === '1' || Number(page) > this.totalPage) {
      return this.findAll();
    }

    const indexOf = this.limitItem * (Number(page) - 1);
    this.lastVisibleCitySnapShot = get.docs[indexOf - 1];

    const sql = query(
      this.firebaseService.productCollection,
      orderBy('name'),
      startAfter(this.lastVisibleCitySnapShot),
      limit(this.limitItem),
    );
    return this.fetchProduct(sql);
  }

  async fetchProduct(payload: Query<DocumentData>): Promise<Product[]> {
    try {
      const q = query(this.firebaseService.productCollection, orderBy('name'));
      const get = await getDocs(q);
      this.totalPage = Math.ceil(get.docs.length / this.limitItem);

      const sql: Query<DocumentData> = payload;

      const snapshot = await getDocs(sql);
      this.lastVisibleCitySnapShot = snapshot.docs[snapshot.docs.length - 1];
      if (!this.lastVisibleCitySnapShot || this.page > this.totalPage) {
        return this.findAll();
      }

      const docArr = [];
      snapshot.docs.forEach((doc) => {
        docArr.push(Object.assign({ id: doc.id }, doc.data()));
      });

      const result = {
        page: this.page,
        total: get.docs.length,
        total_page: this.totalPage,
        per_page: this.limitItem,
        length: snapshot.docs.length,
      };

      return { ...result, ...docArr };
    } catch (error) {
      const firebaseAuthError = error as AuthError;
      console.log(`[NEXT PRODUCTS] -> ${firebaseAuthError.code}`);
      if (firebaseAuthError.code === 'auth/email-already-in-use') {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
    }
  }

  async findById(pid: string): Promise<Product> {
    try {
      const docRef: DocumentReference = doc(
        this.firebaseService.productCollection,
        pid,
      );
      const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef);
      const loggedProduct: Product = {
        ...snapshot.data(),
        id: snapshot.id,
      } as Product;

      return loggedProduct;
    } catch (error) {
      const firebaseAuthError = error as AuthError;
      console.log(`[ID PRODUCTS] -> ${firebaseAuthError.code}`);
      if (firebaseAuthError.code === 'auth/email-already-in-use') {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
    }
  }

  async findByName(str: string): Promise<Product[]> {
    try {
      const sql = query(
        this.firebaseService.productCollection,
        where('name', '>=', str),
        where('name', '<=', str + '\uf8ff'),
        limit(this.limitItem),
      );
      const snapshot = await getDocs(sql);
      const docArr = [];
      snapshot.docs.forEach((doc) => {
        docArr.push(Object.assign({ id: doc.id }, doc.data()));
      });
      return docArr;
    } catch (error) {
      const firebaseAuthError = error as AuthError;
      console.log(`[NAME PRODUCTS] -> ${firebaseAuthError.code}`);
      if (firebaseAuthError.code === 'auth/email-already-in-use') {
        throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
      }
    }
  }
}
