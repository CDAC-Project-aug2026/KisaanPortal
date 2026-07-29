import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentId, setEquipmentId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadReviews();
    loadEquipment();
  }, []);

  const loadReviews = async () => {
    const response = await axios.get("http://localhost:3001/review/all");
    setReviews(response.data);
  };

  // Load the real equipment list so review names always match what is
  // actually in the database, instead of a hardcoded id->name list.
  const loadEquipment = async () => {
    try {
      const response = await axios.get("http://localhost:3001/equipment/all");
      setEquipmentList(response.data || []);
    } catch (error) {
      console.log("Equipment Error:", error);
    }
  };

  const getEquipmentName = (id) => {
    const match = equipmentList.find(
      (item) => String(item.id) === String(id)
    );
    return match ? match.name : `Equipment #${id}`;
  };

  const addReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.warning("Please select rating");
      return;
    }

    await axios.post("http://localhost:3001/review/add", {
      equipmentId,
      userId: localStorage.getItem("userId"),
      rating,
      comment,
    });

    toast.success("Review Added Successfully");

    setEquipmentId("");
    setRating(0);
    setComment("");

    loadReviews();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-green-700">
            Reviews & Ratings
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Share your experience with KisaanPortal equipment.
          </p>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Write a Review
          </h2>

          <form onSubmit={addReview} className="space-y-6">
            <select
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-600 outline-none"
              required
            >
              <option value="">Select Equipment</option>
              {equipmentList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <div>
              <p className="font-semibold mb-3">Your Rating</p>

              <div className="flex gap-2 text-4xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer transition ${
                      rating >= star ? "text-yellow-400 scale-110" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              rows="5"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 resize-none focus:ring-2 focus:ring-green-600 outline-none"
              required
            ></textarea>

            <button className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-lg">
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="grid md:grid-cols-2 gap-7">
          {reviews.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-500">
                No Reviews Yet
              </h2>

              <p className="text-gray-400 mt-2">
                Be the first one to review an equipment.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Top Bar */}
                <div className="h-2 bg-gradient-to-r from-green-600 to-green-400"></div>

                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {getEquipmentName(review.equipmentId)}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Equipment Review
                      </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      #{review.id}
                    </span>
                  </div>

                  <div className="flex mt-4 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating ? "text-yellow-400" : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <p className="text-gray-600 leading-7">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
