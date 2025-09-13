import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, orderBy, onSnapshot,getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // ✅ adjust path

// 🔹 Real-time fetch products from Firestore
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { dispatch }) => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    return new Promise((resolve, reject) => {
      try {
        // Setup listener
        onSnapshot(q, (snapshot) => {
          const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().getTime(), // convert to number
          }));

          // Dispatch into reducer
          dispatch(setProducts(products));

          resolve(products); // For first load
        });
      } catch (err) {
        reject(err);
      }
    });
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    filteredItems: [],
    loading: false,
    error: false,
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.filteredItems = action.payload; // default show all
      state.loading = false;
      state.error = false;
    },
    filterByCategory: (state, action) => {
      const category = action.payload;
      if (category === "all") {
        state.filteredItems = state.items;
      } else {
        state.filteredItems = state.items.filter(
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
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchProducts.fulfilled, (state) => {
        state.loading = false;
        state.error = false;
      });

  },
});

export const selectAllProducts = (state) => state.product.items;
export const selectCategoryProducts = (state) => state.product.filteredItems;
export const { setProducts, filterByCategory } = productSlice.actions;
export default productSlice.reducer;
