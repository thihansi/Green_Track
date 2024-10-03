import { Button, Navbar, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartPopUp from "./CartPopUp";
import WishListPopUp from "./WishListPopUp";

export default function MarketPlaceHeader() {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    // navigate(`/searchResource?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2 sticky top-16 bg-[#3321c8] dark:bg-slate-600 z-40 flex justify-between">
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div className="flex items-center">
        <div
          className="flex items-center relative cursor-pointer mr-[15px]"
          onClick={() => setOpenWishlist(true)}
        >
          <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
          <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
            {wishlist && wishlist.length}
          </span>
        </div>
        <div
          className="flex items-center relative cursor-pointer mr-[15px]"
          onClick={() => setOpenCart(true)}
        >
          <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
          <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
            {cart && cart.length}
          </span>
        </div>

        {/* cart popup */}
        {openCart && <CartPopUp setOpenCart={setOpenCart} />}
        {/* wishlist popup */}
        {openWishlist && <WishListPopUp setOpenWishlist={setOpenWishlist} />}
      </div>
    </Navbar>
  );
}
