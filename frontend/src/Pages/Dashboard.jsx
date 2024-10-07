import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPricing from "../components/IT22003546_Component/PricingTable";
import DashBill from "../components/IT22003546_Component/BillView";
import DashInventory from "../components/IT22577160/DashInventory";
import WasteCollectionList from "../components/IT22350114/DashWasteCollection"


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {/* pricing list */}
      {tab === "pricing-list" && <DashPricing />}
      {/* pricing list */}
      {tab === "bill-view" && <DashBill />}
      {/* Inventory */}
      {tab === "inventory" && <DashInventory />}
      {/* Inventory */}
      {tab === "waste-collection" && <WasteCollectionList />}


    </div>
    
  )
}
