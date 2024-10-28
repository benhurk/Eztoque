import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListItemType } from "../../models";

type listState = {
    items: ListItemType[];
}

const initialState: listState = {
    items: []
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<ListItemType>) => {
            state.items.push(action.payload);
        },

        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.items.forEach(item => {
                if (item.id > action.payload) {
                    item.id -= 1;
                }
            });
        },

        editItem: (state, action: PayloadAction<ListItemType>) => {
            state.items[action.payload.id] = action.payload;
        }
    }
});

export const { addItem, removeItem, editItem } = listSlice.actions;
export default listSlice.reducer;