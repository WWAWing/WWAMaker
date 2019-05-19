import { MakerError } from './MakerSystem';
import WWAData from './WWAData';

export interface LoaderResponse {
    error: LoaderError|null,
    progress: LoaderProgress|null,
    wwaData: WWAData|null
}

export interface LoaderError extends MakerError {}

export interface LoaderProgress {
    current: number;
    total: number;
    stage: LoadStage;
}

export enum LoadStage {
    INIT = 0,
    MAP_LOAD = 1,
    OBJ_LOAD = 2,
    MAP_ATTR = 3,
    OBJ_ATTR = 4,
    RAND_PARTS = 5,
    MESSAGE = 6
}

export enum LoadState {
    EMPTY = 0, // EMPTY は何も開いていない状態を表しますが、もしかしたら利用しないかもしれないです。
    LOADING_MAPDATA = 1,
    LOADING_IMAGE = 2,
    DONE = 3,
    ERROR_MAPDATA = -1,
    ERROR_IMAGE = -2
}
