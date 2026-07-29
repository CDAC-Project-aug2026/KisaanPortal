import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

function AddEquipment() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [image, setImage] = useState(null);

  const addEquipment = async (e) => {
    e.preventDefault();

    try {
     const formData = new FormData();

formData.append("name", name);
formData.append("type", type);
formData.append("location", location);
formData.append("pricePerDay", pricePerDay);
formData.append("available", true);
formData.append("image", image);

await axios.post(
  "http://localhost:3001/equipment/add",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      toast.success("Equipment added successfully 🚜");

      setName("");
setType("");
setLocation("");
setPricePerDay("");
setImage(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add equipment ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Add Equipment
        </h1>

        <form onSubmit={addEquipment} className="space-y-4">

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Equipment Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="w-full border p-3 rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Tractor">Tractor</option>
            <option value="Harvester">Harvester</option>
            <option value="Cultivator">Cultivator</option>
            <option value="Seeder">Seeder</option>
            <option value="Sprayer">Sprayer</option>
            <option value="Tiller">Tiller</option>
          </select>

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Price Per Day"
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
          />

         <div>
  <label className="block mb-2 font-medium">
    Upload Equipment Image
  </label>

  <input
    type="file"
    accept="image/*"
    className="w-full border p-3 rounded-lg"
    onChange={(e) => setImage(e.target.files[0])}
  />
</div>

          <button className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-900">
            Add Equipment
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddEquipment;