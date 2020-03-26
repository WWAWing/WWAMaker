export enum EditMode {
    PUT_MAP = 1,
    PUT_OBJECT = 2,
    EDIT_MAP = 3,
    EDIT_OBJECT = 4,
    DELETE_OBJECT = 5
}

export interface MapState {
    editMode: EditMode;
}
