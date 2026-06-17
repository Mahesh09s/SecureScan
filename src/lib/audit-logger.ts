
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditAction = 
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'ASSET_CREATE'
  | 'ASSET_UPDATE'
  | 'ASSET_DELETE'
  | 'SCAN_START'
  | 'SCAN_STOP'
  | 'VULN_STATUS_CHANGE'
  | 'REPORT_GENERATE'
  | 'ROLE_UPDATE'
  | 'SETTINGS_CHANGE'
  | 'API_KEY_CREATE'
  | 'API_KEY_REVOKE'
  | 'MFA_TOGGLE'
  | 'PASSWORD_CHANGE';

export const logAuditEvent = async (
  userId: string,
  userEmail: string,
  action: AuditAction,
  details: string,
  resourceId?: string
) => {
  try {
    await addDoc(collection(db, 'auditLogs'), {
      userId,
      userEmail,
      action,
      details,
      resourceId: resourceId || null,
      timestamp: serverTimestamp(),
      ipAddress: 'Client-Side' // In a real app, capture via Cloud Function
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};
