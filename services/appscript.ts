
import { storage } from './storage';

/**
 * Service to interact with Google Apps Script Web App.
 * Integrated with local storage simulation for full app functionality.
 */

export interface SyncPayload {
  action: 'create' | 'update' | 'delete';
  type: 'student' | 'faculty' | 'logbook' | 'seminar' | 'agenda' | 'announcement';
  data: any;
  timestamp: string;
}

export const syncToSheets = async (payload: SyncPayload) => {
  try {
    const storageKeyMap: Record<string, string> = {
      student: storage.keys.STUDENTS,
      faculty: storage.keys.FACULTY,
      logbook: storage.keys.LOGBOOKS,
      seminar: storage.keys.SEMINARS,
      agenda: storage.keys.AGENDAS,
      announcement: storage.keys.ANNOUNCEMENTS
    };

    const key = storageKeyMap[payload.type];
    if (key) {
      let currentData = storage.get(key);
      const idKey = payload.type === 'student' ? 'nim' : 'id';

      if (payload.action === 'create') {
        currentData.push(payload.data);
      } else if (payload.action === 'update') {
        currentData = currentData.map((item: any) => 
          item[idKey] === payload.data[idKey] ? payload.data : item
        );
      } else if (payload.action === 'delete') {
        currentData = currentData.filter((item: any) => 
          item[idKey] !== (typeof payload.data === 'object' ? payload.data[idKey] : payload.data)
        );
      }
      
      storage.save(key, currentData);
    }

    console.log(`[Sync Successful] ${payload.type} ${payload.action}`);
    return { success: true, message: 'Data synchronized.' };
  } catch (error) {
    console.error('Sync Error:', error);
    return { success: false, message: 'Sync failed.' };
  }
};

export const fetchSheetsData = async (type: 'student' | 'faculty' | 'logbook' | 'seminar' | 'agenda' | 'announcement') => {
  const storageKeyMap: Record<string, string> = {
    student: storage.keys.STUDENTS,
    faculty: storage.keys.FACULTY,
    logbook: storage.keys.LOGBOOKS,
    seminar: storage.keys.SEMINARS,
    agenda: storage.keys.AGENDAS,
    announcement: storage.keys.ANNOUNCEMENTS
  };
  return storage.get(storageKeyMap[type]);
};
