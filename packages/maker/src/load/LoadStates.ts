import { Progress, LoaderError, LoaderProgress } from "@wwawing/loader";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Load モジュールについて
 *     WWA Maker の Load モジュールはマップデータの読み込みに関する状態を管理しています。
 *     読み込みの開始 → 読み込みの途中経過 → 読み込み完了/読み込みエラー の際にこの Load モジュールが働きます。
 * @see MapData
 */
export type LoadState =
    null |
    (
        {
            stage: "MAPDATA",
            progress?: Progress,
            error?: LoaderError
        } |
        {
            stage: "IMAGE",
            error?: NodeJS.ErrnoException
        } |
        {
            stage: "DONE",
            error?: undefined
        }
    ) & {
        currentFilePath?: string
    };

const loadSlice = createSlice({
    name: 'load',
    initialState: null as LoadState,
    reducers: {
        startMapdataLoading: (state, action: PayloadAction<string>) => {
            if (state?.stage === "MAPDATA") {
                console.warn("現在別のマップデータを読み込んでいる途中だそうです。動作に不都合が発生するかもしれません。");
            }
            return {
                stage: "MAPDATA",
                currentFilePath: action.payload
            };
        },
        startImageLoading: state => {
            if (state === null) {
                throw new Error("マップデータを読み込んでいません。先にマップデータの読み込みを完了させてください。");
            }
            if (state?.stage === "IMAGE") {
                console.warn("現在別のイメージを読み込んでいる途中だそうです。動作に不都合が発生するかもしれません。");
            }
            return {
                ...state,
                stage: "IMAGE"
            };
        },
        setLoadingProgress: (state, action: PayloadAction<LoaderProgress>) => {
            if (state?.stage !== "MAPDATA") {
                throw new Error("setLoadingProgress アクションはマップデータの読み込みでのみ使用できます。マップデータの読み込み開始を宣言したか確認してください。");
            }
            state.progress = action.payload;
        },
        setMapdataLoadingError: (state, action: PayloadAction<LoaderError>) => {
            if (state?.stage !== "MAPDATA") {
                throw new Error("現在マップデータを読み込んでいません。すでに読み込みは完了していましたか？");
            }
            state.error = action.payload;
        },
        setImageLoadingError: (state, action: PayloadAction<NodeJS.ErrnoException>) => {
            if (state?.stage !== "IMAGE") {
                throw new Error("現在画像データを読み込んでいません。すでに読み込みは完了していましたか？");
            }
            state.error = action.payload;
        },
        completeLoading: state => {
            if (state === null) {
                throw new Error("読み込みステータス情報が存在しません。マップデータの読み込み開始を宣言したか確認してください。");
            }
            if (state?.error) {
                throw new Error("現在読み込みでエラーが発生しています。正常に読み込み完了の手続きを完了できません。");
            }
            return {
                ...state,
                stage: "DONE",
                error: undefined
            };
        },
        updateFilePath: (state, action: PayloadAction<string>) => {
            if (state === null) {
                throw new Error("読み込みステータス情報が存在しません。マップデータの読み込み開始を宣言したか確認してください。");
            }
            return {
                ...state,
                currentFilePath: action.payload
            }
        }
    }
});

export const {
    startMapdataLoading,
    startImageLoading,
    setLoadingProgress,
    setMapdataLoadingError,
    setImageLoadingError,
    completeLoading,
    updateFilePath
} = loadSlice.actions;

export const loadReducer = loadSlice.reducer;
