import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../src/MainLayout.jsx/Mainlayout";
import Login from "../src/Pages/Auth/Login";
import Register from "../src/Pages/Auth/Register";
import Home from "../src/Pages/Home/Home";
import Aboutus from "../src/Pages/Home/Aboutus";
import AllService from "../src/Pages/Service/AllService";
import ServiceLayout from "../src/Pages/Service/ServiceLayout";
import ManageService from "../src/Pages/Service/ManageService";
import Bookedservice from "../src/Pages/Service/Bookedservice";
import PrivetRouts from "../src/Privetrouts/PrivetRouts";
import SignleServices from "../src/Pages/Service/SignleServices";
import Editservice from "../src/Pages/Service/Editservice";
import Errorpage from "../src/Pages/Errorpage";
import Faq from "../src/Pages/Home/Faq/Faq";
import DashboardLayout from "../src/Dashbord/DashboardLayout";
import ServiceOverview from "../src/Dashbord/ServiceProvider/Overview";
import Addservices from "../src/Dashbord/ServiceProvider/Addservices";
import MyServices from "../src/Dashbord/ServiceProvider/MyService";
import ServiceProviderProfile from "../src/Dashbord/ServiceProvider/ProfileSetting";
import Settings from "../src/Dashbord/ServiceProvider/Setting";
import ContactUs from "../src/Pages/Home/Contactus";

const Routs = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout></Mainlayout>,
    errorElement: <Errorpage></Errorpage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "login",
        element: <Login></Login>,
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "aboutus",
        element: <Aboutus></Aboutus>,
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "contactus",
        element: <ContactUs/>,
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        errorElement: <Errorpage></Errorpage>,
        children: [
          {
            path: "",
            element: <ServiceOverview />
          },
          {
            path:"addservice",
            element:<Addservices/>
          }
          ,
          {
            path:"myservices",
            element:<MyServices/>
          },
          {
            path:"profilesetting",
            element:<ServiceProviderProfile/>
          },
           {
            path:"settings",
            element:<Settings/>
          },
        ]
      },
      {
        path: "register",
        element: <Register></Register>,
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "faq",
        element: <Faq></Faq>,
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "allservices",
        element: <AllService></AllService>,
        errorElement: <Errorpage></Errorpage>,

        loader: () => fetch("http://localhost:5000/addservice"),
      },
      {
        path: "servicetodo",
        element: (
          <PrivetRouts>
            <ServiceLayout></ServiceLayout>
          </PrivetRouts>
        ),
        errorElement: <Errorpage></Errorpage>,
      },

      {
        path: "manageservices",
       
        element: (
          <PrivetRouts>
            <ManageService></ManageService>
          </PrivetRouts>
        ),
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "bookedservice",
        element: (
          <PrivetRouts>
            <Bookedservice></Bookedservice>
          </PrivetRouts>
        ),
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "addservice/:id",
        element: (
          <PrivetRouts>
            <SignleServices></SignleServices>
          </PrivetRouts>
        ),
        errorElement: <Errorpage></Errorpage>,

        loader: ({ params }) =>
          fetch(`http://localhost:5000/addservice/${params.id}`),
      },
      {
        path: "addservice2/:id",
        element: (
          <PrivetRouts>
            <Editservice></Editservice>
          </PrivetRouts>
        ),
        loader: ({ params }) =>
          fetch(`http://localhost:5000/addservice2/${params.id}`),
        errorElement: <Errorpage></Errorpage>,
      },
    ],
  },
]);

export default Routs;
