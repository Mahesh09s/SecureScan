"use client";

import { useEffect, useState } from 'react';
import { auth, db } from './config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  onSnapshot, 
  Query, 
  DocumentData, 
  QuerySnapshot 
} from 'firebase/firestore';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

/**
 * @fileOverview Core Firebase hooks optimized for production with contextual error handling.
 */

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  return { currentUser, loading, auth };
};

export const useFirestore = () => {
  return db;
};

export function useCollection<T = DocumentData>(query: Query | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items = snapshot.docs.map((doc) => ({
          ...(doc.data() as T),
          id: doc.id,
        }));
        setData(items);
        setLoading(false);
      },
      async (serverError) => {
        // Construct rich contextual error for security rule failures
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query?.path?.toString() || 'unknown/collection',
          operation: 'list',
        });

        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
