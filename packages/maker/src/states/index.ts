import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as MapData from './MapData';
import createSagaMiddleware from '@redux-saga/core';
import mySaga from './sagas';

const rootReducer = combineReducers({
    mapData: MapData.MapDataReducer
});
export type AppState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();
export const Store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(mySaga);
