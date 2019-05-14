import { combineReducers } from 'redux';
import WWADataReducer from './WWADataReducer';

export const rootReducer = combineReducers({
    // FIXME: Reducer の型が合わない
    wwaData: WWADataReducer
});

export type AppState = ReturnType<typeof rootReducer>;
