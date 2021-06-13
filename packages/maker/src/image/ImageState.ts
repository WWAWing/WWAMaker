import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const imageSlice = createSlice({
    name: 'image',
    initialState: null as string | null,
    reducers: {
        /**
         * 画像リソースを設定します。
         */
        setImage(state, action: PayloadAction<string>) {
            if (state != null) {
                URL.revokeObjectURL(state);
            }
            return action.payload;
        },
        /**
         * 画像リソースを閉じます。
         */
        closeImage(state) {
            if (state != null) {
                URL.revokeObjectURL(state);
            }
            return null;
        }
    }
})

export const { setImage, closeImage } = imageSlice.actions;
export const imageReducer = imageSlice.reducer;
