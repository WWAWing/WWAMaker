import { createSlice } from "@reduxjs/toolkit";

export type ModalState = {
    open: false
} | {
    open: true,
    mode: "TESTPLAY"
};

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        open: false,
    } as ModalState,
    reducers: {
        openTestPlay() {
            return {
                open: true,
                mode: "TESTPLAY"
            }
        },
        closeModal() {
            return {
                open: false
            }
        }
    }
});

export const { openTestPlay, closeModal } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
