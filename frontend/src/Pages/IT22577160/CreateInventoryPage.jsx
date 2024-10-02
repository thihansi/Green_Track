import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "react-toastify";

export default function CreateInventoryPage() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    image: "",
    quantity: "",
    condition: "",
    description: "",
    location: "",
    type: "rent",
    offer: false,
    regularPrice: 25,
    discountPrice: 0,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to handle image upload
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(
            "could not upload image (File must be less than 2MB)"
          );
          setImageUploadProgress(null);
        },
        () => {
          // When upload is complete, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure discount price is less than the regular price
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      // Make API request to create inventory
      const res = await fetch("/api/inventory/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data in the body
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      if (res.ok) {
        setError(null);
        navigate(`/dashboard?tab=inventory`);
        toast.success("Added One Item to Inventory");
      }
    } catch (error) {
      setError("Failed to create shared resource listing");
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl text-center my-7 font-extrabold underline text-blue-950 dark:text-slate-300">
        Create Inventory Listing
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            onChange={handleChange}
            value={formData.itemName}
            placeholder="Item Name"
            required
            id="itemName"
            className="flex-1"
          />
          <Select
            className=""
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
        <div className="flex  gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert className="mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce">
            {imageUploadError}
          </Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-72 object-cover"
          />
        )}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="number"
            onChange={handleChange}
            value={formData.quantity}
            id="quantity"
            placeholder="Quantity"
            min="1"
            max="100"
            className="w-[50%]"
            required
          />
          <TextInput
            type="number"
            onChange={handleChange}
            value={formData.condition}
            id="condition"
            placeholder="Condition"
            min="1"
            max="100"
            className="w-[50%]"
            required
          />
        </div>
        <Textarea
          type="text"
          onChange={handleChange}
          value={formData.description}
          placeholder="Add a Description..."
          rows="3"
          maxLength="500"
          id="description"
          required
        />
        <TextInput
          type="text"
          onChange={handleChange}
          value={formData.location}
          id="location"
          placeholder="Location"
          required
        />
        <p className="text-lg font-semibold">Sell / Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            onClick={handleChange}
            value="sale"
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              formData.type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            onClick={handleChange}
            value="rent"
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              formData.type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex">
          <button
            type="button"
            id="offer"
            onClick={handleChange}
            value={true}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !formData.offer
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            } `}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            onClick={handleChange}
            value={false}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              formData.offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <div className="flex items-center gap-2">
          <TextInput
            type="number"
            onChange={handleChange}
            value={formData.regularPrice}
            id="regularPrice"
            min="25"
            max="10000000"
            className="w-[50%]"
            required
          />
          <div>
            <p className="font-semibold">Regular Price</p>
            <span className="text-xs">($ / month)</span>
          </div>
        </div>
        {formData.offer && (
          <div className="flex items-center gap-2">
            <TextInput
              type="number"
              onChange={handleChange}
              value={formData.discountPrice}
              id="discountPrice"
              min="0"
              max="10000000"
              className="w-[50%]"
              required
            />
            <div>
              <p className="font-semibold">Discount Price</p>
              <span className="text-xs">($ / month)</span>
            </div>
          </div>
        )}
        <Button
          type="submit"
          gradientDuoTone="tealToLime"
          className="uppercase"
        >
          Create Shared Resource Listing
        </Button>
        {error && (
          <Alert className="mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce">
            {error}
          </Alert>
        )}
      </form>
    </div>
  );
}
