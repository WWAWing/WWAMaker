import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalPartsType = "OBJECT" | "MAP" | "BOTH";

export type ModalState = {
    open: false
} | {
    open: true,
    mode: "BROWSE_MAP"
} | {
    open: true,
    mode: "BROWSE_PARTS",
    type: "OBJECT" | "MAP" | "BOTH"
};

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        open: false,
    } as ModalState,
    reducers: {
        browseMap() {
            return {
                open: true,
                mode: "BROWSE_MAP"
            }
        },
        browseParts(state, action: PayloadAction<ModalPartsType>) {
            return {
                open: true,
                mode: "BROWSE_PARTS",
                type: action.payload
            }
        },
        closeModal() {
            return {
                open: false
            }
        }
    }
});

export const { browseMap, closeModal } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
