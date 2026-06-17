/**
 * @fileOverview Specialized error classes for Firestore permission and security rule failures.
 */

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    super(`FirestoreError: Missing or insufficient permissions at ${context.path}`);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // Set the prototype explicitly for custom errors in TS
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
