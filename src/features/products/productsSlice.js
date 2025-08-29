import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async fetch products
export const fetchProducts = createAsyncThunk("product/fetchProducts", async () => {
  // for now using fake API, you can replace with your backend later
  const res = await axios.get("https://fakestoreapi.com/products");

  
  return res.data;
});

const productSlice = createSlice({
  name: "product",
  initialState: { items: [],
    catagoryItems:[]
    , loading: false,error: false },
  reducers: {
   addProduct: (state, action) => {
    // push new product into items array
    state.items.push(action.payload);

    // also update categoryItems so UI refreshes immediately
   
  },
     filterByCategory: (state, action) => {
      const category = action.payload;
      if (category === "all") {
        state.catagoryItems = state.items; // show all
      } else {
        state.catagoryItems = state.items.filter(
          (item) => item.category === category
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = true;
       
      });
  },


});

export const { addProduct,filterByCategory } = productSlice.actions;
export default productSlice.reducer;
