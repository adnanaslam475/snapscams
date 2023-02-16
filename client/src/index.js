import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// plugins styles from node_modules
import "react-notification-alert/dist/animate.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "@fullcalendar/common/main.min.css";
import "@fullcalendar/daygrid/main.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "quill/dist/quill.core.css";

// import "~slick-carousel/slick/slick.css";
// import "~slick-carousel/slick/slick-theme.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
// plugins styles downloaded
import "assets/vendor/nucleo/css/nucleo.css";
// core styles
import "assets/scss/argon-dashboard-pro-react.scss?v1.2.1";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import AuthLayout from "layouts/Auth.js";
import IndexView from "views/Index.js";
import { Provider, initialState, userReducer } from "store";

const root = ReactDOM.createRoot(document.getElementById("root"));

firebase.initializeApp({
  apiKey: "AIzaSyBxqH55VMdnAOPyt62gEM6w2oH84Nk2Qrc",
  authDomain: "vuepractice-7ee82.firebaseapp.com",
  databaseURL: "https://vuepractice-7ee82-default-rtdb.firebaseio.com",
  projectId: "vuepractice-7ee82",
  storageBucket: "vuepractice-7ee82.appspot.com",
  messagingSenderId: "538423555153",
  appId: "1:538423555153:web:db5235aa601dd2cbd57470",
  measurementId: "G-LFR5SEN6H9",
});

export const db = firebase.firestore();

root.render(
  <BrowserRouter>
    <Provider initialState={initialState} reducer={userReducer}>
      <Switch>
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route path="/rtl" render={(props) => <RTLLayout {...props} />} />
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Route path="/" render={(props) => <IndexView {...props} />} />
        {/* <Redirect from="*" to="/auth/login" /> */}
      </Switch>
    </Provider>
  </BrowserRouter>
);
