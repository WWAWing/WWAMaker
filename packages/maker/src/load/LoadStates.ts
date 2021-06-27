import { encodeImagePromise, loadImagePromise } from "./LoadPromises";
import { Progress, LoaderError, LoaderProgress } from "@wwawing/loader";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { closeImage, setEncodedImage } from "../image/ImageState";
import { WWAData } from "@wwawing/common-interface";
import { closeMapdata, setMapdata } from "../wwadata/WWADataState";

type LoadStage = null | "MAPDATA" | "IMAGE";

/**
 * Load モジュールについて
 *     WWA Maker の Load モジュールはマップデータの読み込みに関する状態を管理しています。
 *     読み込みの開始 → 読み込みの途中経過 → 読み込み完了/読み込みエラー の際にこの Load モジュールが働きます。
 * @see MapData
 */
export type LoadState =
    null |
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
        stage: "IMAGE_ENCODING",
        error?: ErrorEvent
    };

/**
 * イメージを読み込むアクションです。
 *     基本設定の編集のような、画像だけの再読み込みを必要とする場合に使用します。
 */
export const setImage = createAsyncThunk<void, string, { rejectValue: ErrorEvent }>(
    'load/image',
    async (imagePath, thunkAPI) => {
        const imageData = await loadImagePromise(imagePath);
        const imageUrl = await encodeImagePromise(imageData);
        thunkAPI.dispatch(setEncodedImage(imageUrl));
    }
);

/**
 * 読み込みできたマップデータファイルのデータを State にセットします。
 */
export const loadMapdata = createAsyncThunk<void, { filePath: string, data: WWAData }, { rejectValue: LoaderError }>(
    'load/wwadata',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(closeMapdata());
        thunkAPI.dispatch(closeImage());
        thunkAPI.dispatch(setMapdata(data.data));
    }
);

const loadSlice = createSlice({
    name: 'load',
    initialState: null as LoadState,
    reducers: {
        startMapdataLoading: state => {
            if (state?.stage === "MAPDATA") {
                console.warn("現在別のマップデータを読み込んでいる途中だそうです。動作に不都合が発生するかもしれません。");
            }
            return {
                stage: "MAPDATA"
            };
        },
        startImageLoading: state => {
            if (state?.stage === "IMAGE") {
                console.warn("現在別のイメージを読み込んでいる途中だそうです。動作に不都合が発生するかもしれません。");
            }
            return {
                stage: "IMAGE"
            };
        },
        setLoadingProgress: (state, action: PayloadAction<LoaderProgress>) => {
            if (state?.stage !== "MAPDATA") {
                throw new Error("setLoadingProgress アクションはマップデータの読み込みでのみ使用できます。");
            }
            state.progress = action.payload;
        },
        setMapdataLoadingError: (state, action: PayloadAction<LoaderError>) => {
            if (state?.stage !== "MAPDATA") {
                throw new Error("現在マップデータを読み込んでいません。すでに読み込みは完了していましたか？");
            }
            state.error = action.payload;
        },
        setImageLoadingError: (state, action: PayloadAction<any>) => {
            if (state?.stage !== "IMAGE") {
                throw new Error("現在画像データを読み込んでいません。すでに読み込みは完了していましたか？");
            }
            state.error = action.payload;
        },
        completeLoading: state => {
            if (state?.error !== null) {
                throw new Error("現在読み込みでエラーが発生しています。正常に読み込み完了の手続きを完了できません。");
            }
            return null;
        }
    },
    extraReducers: builder => {
        builder.addCase(setImage.rejected, (state, action) => {
            if (state?.stage !== "IMAGE_ENCODING") {
                throw new Error("現在画像データのエンコーディングの段階にありません。すでにエンコーディングは完了していましたか？");
            }
            if (action.payload === undefined) {
                throw new Error("エンコーディングでエラーが発生しましたが、正常にエラー情報を読み取ることができませんでした。");
            }
            state.error = action.payload;
        });
        builder.addCase(setImage.fulfilled, state => {
            if (state?.error !== null) {
                throw new Error("現在読み込みでエラーが発生しています。正常に読み込み完了の手続きを完了できません。");
            }
            return null;
        });
    }
});

export const {
    startMapdataLoading,
    startImageLoading,
    setLoadingProgress,
    setMapdataLoadingError,
    setImageLoadingError,
    completeLoading
} = loadSlice.actions;

export const loadReducer = loadSlice.reducer;
