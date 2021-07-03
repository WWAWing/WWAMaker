import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const imageSlice = createSlice({
    name: 'image',
    initialState: null as string | null,
    reducers: {
        /**
         * Blob を作成し、 Blob からオブジェクト URL を作成します。
         */
        setImage(state, action: PayloadAction<Buffer>) {
            if (state != null) {
                URL.revokeObjectURL(state);
            }
            const blob = new Blob([ action.payload ], { type: "image/gif" });
            return URL.createObjectURL(blob);
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
