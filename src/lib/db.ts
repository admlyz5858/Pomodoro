import { openDB } from 'idb'
import { AppState } from '../types'
import { createInitialState } from './gameEngine'

const DB_NAME = 'focus-universe'
const STORE_NAME = 'state'
const KEY = 'app'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME)
    }
  },
})

export const loadState = async (): Promise<AppState> => {
  try {
    const db = await dbPromise
    const state = await db.get(STORE_NAME, KEY)

    if (state) {
      return state as AppState
    }
  } catch (error) {
    console.warn('Unable to load Focus Universe state', error)
  }

  return createInitialState()
}

export const saveState = async (state: AppState): Promise<void> => {
  try {
    const db = await dbPromise
    await db.put(STORE_NAME, state, KEY)
  } catch (error) {
    console.warn('Unable to save Focus Universe state', error)
  }
}
