import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUs";
import FooterComponent from "./components/FooterComponent";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import CreateInventoryPage from "./Pages/IT22577160/CreateInventoryPage";
import UpdateInventoryPage from "./Pages/IT22577160/UpdateInventoryPage";
import MarketPlace from "./Pages/IT22577160/MarketPlace";
import SearchInventoryItemsPage from "./Pages/IT22577160/SearchInventoryItemsPage";
import InventoryItemPage from "./Pages/IT22577160/InventoryItemPage";
import AdminPricingTable from "./components/IT22003546/PricingTable";
import BillView from "./components/IT22003546/BillView";
import WasteCollection from "./Pages/IT22350114/WasteCollection";
import WasteCollectionForm from "./Pages/IT22350114/WasteCollectionForm";
import WasteCollectionList from "./components/IT22350114/WasteCollectionList";
import DashWasteSchedule from "./components/IT22607232/DashWasteSchedule";
import CreateRequestPage from "./Pages/IT22607232/CreateRequestPage";
import RequestTable from "./Pages/IT22607232/RequestTable";
import UpdateSchedules from "./Pages/IT22607232/UpdateRequest";
import AllRequestsAdmin from "./components/IT22607232/AllRequestsAdmin";


const App = () => {
  return (
    <>
      <Router>
        <Header />
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/signIn" element={<SignInPage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/pricing-list" element={<AdminPricingTable />} />
            <Route path="/bill-view" element={<BillView />} />
           

            <Route path="/marketPlace" element={<MarketPlace />} />
            <Route path="/searchInventoryItems" element={<SearchInventoryItemsPage />} />
            <Route path="/sharedResource/:resourceSlug" element={<InventoryItemPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/create-inventoryListing"
                element={<CreateInventoryPage />}
              />
              <Route
                path="/update-inventoryListing/:resourceId"
                element={<UpdateInventoryPage />}
              />
               <Route path="/waste-schedule" element={<DashWasteSchedule />} />
              <Route path="/create-request" element={<CreateRequestPage />} />
              <Route path="/request-table" element={<RequestTable />} />
              <Route path="/update-schedule/:requestid" element={<UpdateSchedules />} />
              <Route path="/all-requests" element={<AllRequestsAdmin />} />
            </Route>

            {/* IT22350114 Routes */}
            <Route path="/wastecollection" element={<WasteCollection />} />
            <Route path="/wastecollection/form" element={<WasteCollectionForm />} />
            <Route path="/update/:collectionId" element={<WasteCollectionForm />} /> 
        
          </Routes>
        </div>
        <FooterComponent />
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
