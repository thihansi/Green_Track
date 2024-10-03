import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MarketPlaceHeader from "../../components/IT22577160/MarketPlaceHeader";
import { addToCart } from "../../redux/IT22577160/cartSlice.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/IT22577160/wishListSlice.js";

export default function SearchInventoryItemsPage() {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "Uncategorized",
  });
  const [sharedResources, setSharedResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [click, setClick] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchSharedResources = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `/api/inventory/getInventoryItems?${searchQuery}`
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSharedResources(data.resources);
        setLoading(false);
        if (data.resources.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchSharedResources();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "Uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/searchInventoryItems?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = sharedResources.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/inventory/getInventoryItems?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setSharedResources([...sharedResources, ...data.resources]);
      if (data.resources.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  const addToCartHandler = async (id) => {
    const existingItem = cart && cart.find((i) => i._id === id);
    if (existingItem) {
      toast.error("Item already in the cart");
    } else {
      const clickedResource = sharedResources.find(
        (resource) => resource._id === id
      );
      if (clickedResource.quantity < 1) {
        toast.error("Sorry! The quantity is not available in stock");
      } else {
        const cartData = { ...clickedResource, quantity: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully");
      }
    }
  };

  const removeFromWishListHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data._id));
  };

  const addToWishListHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  useEffect(() => {
    if (
      sharedResources &&
      wishlist &&
      wishlist.find((i) => i._id === sharedResources._id)
    ) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, sharedResources]);

  return (
    <>
      <MarketPlaceHeader />
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <TextInput
                placeholder="Search..."
                id="searchTerm"
                type="text"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <Select
                onChange={handleChange}
                value={sidebarData.sort}
                id="sort"
              >
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Category:</label>
              <Select
                onChange={handleChange}
                value={sidebarData.category}
                id="category"
              >
                <option value="Uncategorized">Select a Category</option>
                <option value="Bins">Bins</option>
                <option value="Composters">Composters</option>
                <option value="Recycling Containers">Recycling Containers</option>
                <option value="Shredders">Shredders</option>
                <option value="Waste Bags">Waste Bags</option>
                <option value="Waste Collection Trucks">Waste Collection Trucks</option>
                <option value="Hazardous Waste Containers">Hazardous Waste Containers</option>
                <option value="Incinerators">Incinerators</option>
                <option value="Waste Compactors">Waste Compactors</option>
                <option value="Landfill Equipment">Landfill Equipment</option>
              </Select>
            </div>
            <Button type="submit" gradientDuoTone="purpleToBlue">
              SEARCH
            </Button>
          </form>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
            Posts results:
          </h1>
          <div className="p-7 flex flex-wrap gap-4">
            {!loading && sharedResources.length === 0 && (
              <p className="text-xl text-gray-500">No posts found.</p>
            )}
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading &&
              sharedResources &&
              sharedResources.map((resource) => (
                <div key={resource._id}>
                  <div className="group relative w-full border border-teal-500 overflow-hidden rounded-lg sm:w-[330px] transition-all">
                    <Link to={`/sharedResource/${resource.slug}`}>
                      <img
                        src={resource.image}
                        alt="post cover"
                        className="h-[230px] w-full object-cover  transition-all duration-300 z-20"
                      />
                    </Link>
                    <div className="p-3 flex flex-col gap-2">
                      <p className="text-lg font-semibold line-clamp-2">
                        {resource.title}
                      </p>
                      <div className="flex justify-between">
                        <span className="italic text-sm">
                          {resource.category}
                        </span>
                        <div className="flex text-xs">
                          <AiFillStar
                            className="mr-2 cursor-pointer"
                            color="#F6BA00"
                            size={20}
                          />
                          <AiFillStar
                            className="mr-2 cursor-pointer"
                            color="#F6BA00"
                            size={20}
                          />
                          <AiFillStar
                            className="mr-2 cursor-pointer"
                            color="#F6BA00"
                            size={20}
                          />
                          <AiFillStar
                            className="mr-2 cursor-pointer"
                            color="#F6BA00"
                            size={20}
                          />
                          <AiOutlineStar
                            className="mr-2 cursor-pointer"
                            color="#F6BA00"
                            size={20}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex">
                          <h5 className="font-bold text-[18px] text-slate-800 dark:text-teal-500 font-Roboto">
                            {resource.regularPrice === 0
                              ? resource.regularPrice + " $"
                              : resource.regularPrice -
                                resource.discountPrice +
                                " $"}
                          </h5>
                          <h4 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through">
                            {resource.regularPrice
                              ? resource.regularPrice + " $"
                              : null}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4">
                          {wishlist &&
                          wishlist.find((item) => item._id === resource._id) ? (
                            <AiFillHeart
                              size={22}
                              onClick={() =>
                                removeFromWishListHandler(resource)
                              }
                              className="cursor-pointer text-red-600"
                              title="Remove from wishlist"
                            />
                          ) : (
                            <AiOutlineHeart
                              size={22}
                              onClick={() => addToWishListHandler(resource)}
                              className="cursor-pointer text-gray-500"
                              title="Add to wishlist"
                            />
                          )}
                          <AiOutlineEye size={22} title="Quick view" />
                          <AiOutlineShoppingCart
                            size={22}
                            title="Add to cart"
                            onClick={() => addToCartHandler(resource._id)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {showMore && (
              <button
                onClick={handleShowMore}
                className="text-teal-500 hover:underline p-7 text-center w-full"
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
