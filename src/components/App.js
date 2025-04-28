import React, { useEffect, useState } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPlant, setNewPlant] = useState({
    name: "",
    image: "",
    price: ""
  });

  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((r) => r.json())
      .then((data) => setPlants(data));
  }, []);

  function handleChange(e) {
    setNewPlant({
      ...newPlant,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const plantToAdd = {
      name: newPlant.name,
      image: newPlant.image,
      price: parseFloat(newPlant.price),
      isSoldOut: false
    };

    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(plantToAdd)
    })
      .then((r) => r.json())
      .then((newPlantFromServer) => {
        setPlants([...plants, newPlantFromServer]);
        setNewPlant({ name: "", image: "", price: "" });
      });
  }

  function handleSoldOut(plantId) {
    const updatedPlants = plants.map((plant) => {
      if (plant.id === plantId) {
        return { ...plant, isSoldOut: !plant.isSoldOut };
      }
      return plant;
    });
    setPlants(updatedPlants);
  }

  function handleDelete(plantId) {
    fetch(`http://localhost:6001/plants/${plantId}`, {
      method: "DELETE"
    }).then(() => {
      const updatedPlants = plants.filter((plant) => plant.id !== plantId);
      setPlants(updatedPlants);
    });
  }

  function handlePriceUpdate(plantId, newPrice) {
    fetch(`http://localhost:6001/plants/${plantId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ price: parseFloat(newPrice) })
    })
      .then((r) => r.json())
      .then((updatedPlant) => {
        const updatedPlants = plants.map((plant) => {
          if (plant.id === updatedPlant.id) {
            return updatedPlant;
          }
          return plant;
        });
        setPlants(updatedPlants);
      });
  }

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Plantsy 🌱</h1>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "#ccffcc", padding: "1em" }}>
        <h2>New Plant</h2>
        <input
          type="text"
          name="name"
          placeholder="Plant name"
          value={newPlant.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newPlant.image}
          onChange={handleChange}
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={newPlant.price}
          onChange={handleChange}
        />
        <button type="submit">Add Plant</button>
      </form>

      
      <div style={{ margin: "1em 0" }}>
        <h3>Search Plants:</h3>
        <input
          type="text"
          placeholder="Type a name to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

     
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1em" }}>
        {filteredPlants.map((plant) => (
          <div key={plant.id} style={{ width: "200px", textAlign: "center", border: "1px solid #ddd", padding: "1em", borderRadius: "8px" }}>
            <img
              src={plant.image}
              alt={plant.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <h4>{plant.name}</h4>
            <p>Price: ${plant.price}</p>

            
            <input
              type="number"
              step="0.01"
              placeholder="New Price"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePriceUpdate(plant.id, e.target.value);
                  e.target.value = "";
                }
              }}
              style={{ width: "100px", marginBottom: "0.5em" }}
            />

            <div style={{ marginTop: "0.5em" }}>
              <button
                onClick={() => handleSoldOut(plant.id)}
                style={{
                  backgroundColor: plant.isSoldOut ? "gray" : "green",
                  color: "white",
                  padding: "0.5em",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "5px"
                }}
              >
                {plant.isSoldOut ? "Sold Out" : "In Stock"}
              </button>

              <button
                onClick={() => handleDelete(plant.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "0.5em",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
