import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from './firestore-key-5cddf-472039f8dbb6.json';
import { getFirestore } from 'firebase-admin/firestore';
import { DocumentDatabase } from '@src/types';
import { Document, DocumentData, DocumentStorageData } from '@notespace/shared/crdt/types/document';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/crdt/types/operations';
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;

export default function DocumentFirestoreDatabase(): DocumentDatabase {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  const db = getFirestore();
  const documents = db.collection('documents');

  async function getDocuments(): Promise<DocumentData[]> {
    const snapshot = await documents.get();
    return snapshot.docs.map(doc => {
      const { id, title } = doc.data() as Document;
      return { id, title };
    });
  }

  async function createDocument() {
    const id = uuid();
    const docData: DocumentStorageData = {
      id,
      title: '',
      operations: [],
    };
    await documents.doc(id).set(docData);
    return id;
  }

  async function getDocument(id: string): Promise<DocumentStorageData> {
    const doc = await documents.doc(id).get()
    if (!doc.exists) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    return doc.data() as DocumentStorageData;
  }

  async function deleteDocument(id: string) {
    const doc = await documents.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    await documents.doc(id).delete();
  }

  async function updateDocument(id: string, newOperations: Operation[]) {
    try{
      const doc = documents.doc(id)
      await doc.update({operations: FieldValue.arrayUnion(newOperations)})
    } catch (e) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
  }

  async function updateTitle(id: string, title: string) {
    try{
      const doc = await documents.doc(id)
      await doc.update({title})
    }catch (e){
      throw new NotFoundError(`Document with id ${id} not found`);
    }
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
    updateTitle,
  };
}
