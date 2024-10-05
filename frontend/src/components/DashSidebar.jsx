import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiTrash, HiTruck, HiUser } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import { GrResources } from "react-icons/gr";

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56 shadow-md">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && ( // Render only if isAdmin is true
            <>
              <Link to="/dashboard?tab=pricing-list">
                <Sidebar.Item
                  active={tab === "pricing-list"}
                  icon={HiUser}
                  labelColor="dark"
                  as="div"
                >
                  Pricing Table
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Link to="/dashboard?tab=bill-view">
            <Sidebar.Item
              active={tab === "bill-view"}
              icon={HiUser}
              labelColor="dark"
              as="div"
            >
              Bill View
            </Sidebar.Item>
          </Link>

          {currentUser.EquipmentInventoryManger && (
            <>
              <Link to="/dashboard?tab=inventory">
                <Sidebar.Item
                  active={tab === "inventory"}
                  icon={GrResources}
                  as="div"
                >
                  Inventory
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Link to="/dashboard?tab=waste-schedule">
            <Sidebar.Item
              active={tab === "waste-schedule"}
              icon={HiTruck}
              as="div"
            >
              Schedule Waste
            </Sidebar.Item>
          </Link>

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
