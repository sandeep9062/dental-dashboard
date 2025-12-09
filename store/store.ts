// store/store.ts
import { configureStore } from "@reduxjs/toolkit";

import { blogsApi } from "@/services/blogsApi";

import { websiteImagesApi } from "@/services/websiteImagesApi";
import { siteSettingsApi } from "@/services/siteSettingsApi";
import { contactApi } from "@/services/contactApi";
import { supportApi } from "@/services/supportApi";

import { testimonialsApi } from "@/services/testimonialsApi";

import { plansApi } from "@/services/plansApi";
import { clinicApi } from "@/services/clinicApi";
import { userApi } from "@/services/userApi";

import { cbctOpgLabsApi } from "@/services/cbctOpgLabs";
import { popUpFormApi } from "@/services/popUpFormApi";
import { notificationApi } from "@/services/notificationApi";
import authReducer from "./authSlice";






const store = configureStore({
  reducer: {

    [websiteImagesApi.reducerPath]: websiteImagesApi.reducer,
    [siteSettingsApi.reducerPath]: siteSettingsApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,

    [blogsApi.reducerPath]: blogsApi.reducer,


    [plansApi.reducerPath]: plansApi.reducer,
    [testimonialsApi.reducerPath]: testimonialsApi.reducer,

    [clinicApi.reducerPath]: clinicApi.reducer,
    [cbctOpgLabsApi.reducerPath]: cbctOpgLabsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [popUpFormApi.reducerPath]: popUpFormApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    auth: authReducer,





  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([

      websiteImagesApi.middleware,
      siteSettingsApi.middleware,
      contactApi.middleware,
      supportApi.middleware,
      plansApi.middleware,
      blogsApi.middleware,
      testimonialsApi.middleware,

      clinicApi.middleware,
      cbctOpgLabsApi.middleware,
      userApi.middleware,
      popUpFormApi.middleware,
      notificationApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production", // ✅ enable Redux DevTools in development
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
