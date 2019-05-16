import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import * as WWAData from './WWAData';

export const rootReducer = combineReducers({
    wwaData: WWAData.WWADataReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const Store = createStore(rootReducer, applyMiddleware(ReduxThunk));
