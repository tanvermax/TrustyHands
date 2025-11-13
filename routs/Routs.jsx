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
import SuperAdminHome from "../src/Dashbord/SuperAdmin/Home";
import UserHome from "../src/Dashbord/UserDasbord/serHome";
import Order from "../src/Dashbord/UserDasbord/UserOrder/Order";
import Userriview from "../src/Dashbord/UserDasbord/UserReview/Userriview";
import Support from "../src/Dashbord/UserDasbord/UserSupport/Usersupport";
import TermsAndConditions from "../src/Dashbord/UserDasbord/Termsandcondotion/Terms";
import PostRequest from "../src/Dashbord/UserDasbord/ServiceRequest/ServiceRequest";
import ManageUser from "../src/Dashbord/SuperAdmin/ManageUser/ManageUser";
import ManageServiceProvider from "../src/Dashbord/SuperAdmin/ManageservicePRovider/ManageServiceProvider";
import ManangService from "../src/Dashbord/SuperAdmin/ManageService/ManangService";
import AdminOrderManagement from "../src/Dashbord/SuperAdmin/AdminOrderManagement/AdminOrderManagement";
import ReportManagement from "../src/Dashbord/SuperAdmin/ReportManagement/ReportManagement";
import AdminMessageInbox from "../src/Dashbord/SuperAdmin/AdminMessageInbox/AdminMessageInbox";
import AdminAnalyticsDashboard from "../src/Dashbord/SuperAdmin/AdminAnalyticsDashboard/AdminAnalyticsDashboard";
import ServiceProviderOrders from "../src/Dashbord/ServiceProvider/Order/ServiceProviderOrders";
import SupportRequests from "../src/Dashbord/ServiceProvider/ServiceSupport/SupportRequests";
import AdminSupportPanel from "../src/Dashbord/SuperAdmin/Supportmessage/AdminSupportPanel";
import WalletRecharge from "../src/Dashbord/UserDasbord/WalletRecharge/WalletRecharge";
import ServiceProviderRequests from "../src/Dashbord/ServiceProvider/ServiceProviderRequests/ServiceProviderRequests";

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
        element: <ContactUs />,
        errorElement: <Errorpage></Errorpage>,
      },
      {
        path: "dashboard",
        element: <PrivetRouts><DashboardLayout /></PrivetRouts>,
        errorElement: <Errorpage></Errorpage>,
        children: [{
          path: "superadminhome",
          element: <SuperAdminHome />,

        },
        {
          path:"adminsupport",
          element:<AdminSupportPanel/>
        },
        {
          path: "manageusers",
          element: <ManageUser />
        },
        {
          path: "manage-service-providers",
          element: <ManageServiceProvider />
        },
        {
          path: "ordersMange",
          element: <AdminOrderManagement />
        },
        {
          path: "reports",
          element: <ReportManagement />
        },
        {
          path: "all-services",
          element: <ManangService />
        },
        {
          path: "messages",
          element: <AdminMessageInbox />
        }, {
          path: "analytics",
          element: <AdminAnalyticsDashboard />
        },
        // servicep[rovider]
        {
          path: "serviceproviderhome",
          element: <ServiceOverview />
        },{
          path:"providersupport",
          element:<SupportRequests/>
        },
        {
          path: "orders",
          element: <ServiceProviderOrders />
        },
        {
          path: "addservice",
          element: <Addservices />
        }
        ,{
          path: "servicerequest",
          element: <ServiceProviderRequests />
        }
          ,
        {
          path: "myservices",
          element: <MyServices />
        },
        {
          path: "profilesetting",
          element: <ServiceProviderProfile />
        },
        {
          path: "settings",
          element: <Settings />
        },
        // user routes
        {
          path: "userHome",
          element: <UserHome />,
        },
        {
          path:"wallet",
          element:<WalletRecharge/>
        },
        {
          path: "myorders",
          element: <Order />
        },
        {
          path: "myreviews",
          element: <Userriview />
        },
        {
          path: "support",
          element: <Support />
        },
        {
          path: "terms",
          element: <TermsAndConditions />
        },
        {
          path: "postrequest",
          element: <PostRequest />
        }
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

        loader: () => fetch("https://trusty-hands-backend.vercel.app/addservice"),
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
          fetch(`https://trusty-hands-backend.vercel.app/addservice/${params.id}`),
      },
      {
        path: "addservice2/:id",
        element: (
          <PrivetRouts>
            <Editservice></Editservice>
          </PrivetRouts>
        ),
        loader: ({ params }) =>
          fetch(`https://trusty-hands-backend.vercel.app/addservice2/${params.id}`),
        errorElement: <Errorpage></Errorpage>,
      },
    ],
  },
]);

export default Routs;
