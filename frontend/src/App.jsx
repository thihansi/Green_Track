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
            </Route>
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
