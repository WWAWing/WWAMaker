import { encodeImagePromise, loadImagePromise } from "./LoadPromises";
import { setImage } from "../State";
import { Progress, LoaderError, LoaderProgress } from "@wwawing/loader";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Load モジュールについて
 *     WWA Maker の Load モジュールはマップデータの読み込みに関する状態を管理しています。
 *     読み込みの開始 → 読み込みの途中経過 → 読み込み完了/読み込みエラー の際にこの Load モジュールが働きます。
 * @see MapData
 */
export interface LoadState {
    progress: Progress|null,
    error: LoaderError|null
}

/**
 * イメージを読み込むアクションです。
 *     基本設定の編集のような、画像だけの再読み込みを必要とする場合に使用します。
 */
export const loadImage = createAsyncThunk<void, string, { rejectValue: LoaderError }>(
    'load/image',
    async (imagePath, thunkAPI) => {
        const imageData = await loadImagePromise(imagePath);
        const imageUrl = await encodeImagePromise(imageData);
        thunkAPI.dispatch(setImage(imageUrl));
    }
);

export const INITIAL_STATE: LoadState = {
    progress: null,
    error: null
};

const loadSlice = createSlice({
    name: 'load',
    initialState: {
        progress: null,
        error: null
    } as LoadState,
    reducers: {
        setLoadingProgress: (state, action: PayloadAction<LoaderProgress>) => {
            state.progress = action.payload;
        },
        setLoadingError: (state, action: PayloadAction<LoaderError>) => {
            state.error = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(loadImage.rejected, (state, action) => {
            if (action.payload) {
                state.error = action.payload;
            }
            // TODO: payload が unkown の場合はどうするのか？
        });
        builder.addCase(loadImage.fulfilled, state => {
            state.progress = null;
        });
    }
});

export const { setLoadingProgress, setLoadingError } = loadSlice.actions;

export const LoadReducer = loadSlice.reducer;
