import { createStore } from 'redux';
import { combineReducers } from 'redux';
import * as WWAData from './WWAData';

export const rootReducer = combineReducers({
    wwaData: WWAData.WWADataReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const Store = createStore(rootReducer);
