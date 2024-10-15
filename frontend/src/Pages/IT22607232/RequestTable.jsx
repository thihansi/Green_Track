import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const RequestTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showRequestError, setShowRequestError] = useState(false);
  const [showRequests, setShowRequests] = useState([]);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [RequestIdToDelete, setRequestIdToDelete] = useState("");

  useEffect(() => {
    if (currentUser && currentUser._id) {
      handleShowRequests();
    }
  }, [currentUser]);

  const handleShowRequests = async () => {
    try {
      // Ensure to fetch requests for the logged-in user by passing the user ID
      const res = await fetch(
        `/api/wasteSchedule/get-specific-requests/${currentUser._id}`
      );
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setShowRequestError(true);
        return;
      }

      setShowRequests(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setShowRequestError(true);
    }
  };

  const handleRequestsDelete = async () => {
    try {
      const res = await fetch(
        `/api/wasteSchedule/deleteschedule/${RequestIdToDelete}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        setShowRequests((prev) =>
          prev.filter((request) => request._id !== RequestIdToDelete)
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to download report as PDF
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Date Updated",
      "RequestID",
      "CustomerName",
      "Category",
      "ScheduleDate",
      "Location",
      "Status",
    ];
    const tableRows = showRequests.map((request) => [
      new Date(request.updatedAt).toLocaleDateString(),
      request.RequestID,
      request.CustomerName,
      request.Category,
      request.ScheduleDate,
      request.Location,
      request.Status,
    ]);

    // Set the styling for the PDF
    doc.setFontSize(12);
    doc.text("My Waste Collection Requests\nGreen Track Waste Management System Pvt Ltd", 14, 22);

    // Add the autoTable with styles
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: {
        fillColor: [255, 239, 219],
        textColor: [0, 0, 0],
        fontSize: 10,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { top: 30 },
      theme: "grid",
    });

    // Save the PDF
    doc.save("MyWasteCollectionRequests_report.pdf");
  };

  return (
    <div className="w-full overflow-x-auto md:mx-auto p-5">
      <h1 className="text-2xl text-center font-bold text-teal-600 dark:text-lime-400 mb-5">
        🚛Green Track Waste Management System Pvt Ltd🚛
        <br />
        <br />
        <p>🚮🗑️My Waste Collection Requests 🗑️🚮</p>
      </h1>

      <Table
        hoverable
        className="shadow-lg border border-gray-300 dark:border-gray-600 rounded-lg"
      >
        <Table.Head className="bg-teal-500 text-black dark:white dark:bg-lime-600 rounded-t-lg">
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>RequestID</Table.HeadCell>
          <Table.HeadCell>CustomerName</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>ScheduleDate</Table.HeadCell>
          <Table.HeadCell>Location</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Additional Note</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
          <Table.HeadCell>Edit</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y dark:divide-gray-700">
          {showRequests.length > 0 ? (
            showRequests.map((request) => (
              <Table.Row
                key={request._id}
                className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-shadow duration-300 shadow-sm dark:shadow-gray-900"
              >
                <Table.Cell className="p-3 border-r">
                  {new Date(request.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.RequestID}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.CustomerName}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.Category}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.ScheduleDate}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.Location}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.email}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.Additional_Note}
                </Table.Cell>
                <Table.Cell className="p-3 border-r">
                  {request.Status}
                </Table.Cell>
                <Table.Cell className="p-3 text-red-600 cursor-pointer">
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setRequestIdToDelete(request._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell className="p-3 text-teal-600 dark:text-lime-400">
                  <Link to={`/update-schedule/${request._id}`}>Edit</Link>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="10" className="text-center p-5">
                No requests available
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <Button
        gradientDuoTone="tealToLime"
        className="rounded-md mt-5 bg-teal-500 hover:bg-teal-600 dark:bg-lime-500 dark:hover:bg-lime-600 text-black dark:text-black"
        onClick={handleDownloadReport}
      >
        Download PDF
      </Button>

      {showRequestError && (
        <p className="text-red-700 mt-5">Error fetching requests</p>
      )}

      {/* Modal for deletion confirmation */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg">
              Are you sure you want to delete this request?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleRequestsDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RequestTable;
