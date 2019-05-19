import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as MapData from './MapData';
import createSagaMiddleware from '@redux-saga/core';
import mySaga from './sagas';

const rootReducer = combineReducers({
    mapData: MapData.MapDataReducer
});

const sagaMiddleware = createSagaMiddleware();
sagaMiddleware.run(mySaga);

export type AppState = ReturnType<typeof rootReducer>;
export const Store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);
