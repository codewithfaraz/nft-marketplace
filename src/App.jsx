import { useState } from "react";

function App() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Product A",
      location: "Warehouse 1",
      status: "In Stock",
      lastUpdate: "2023-12-01",
    },
    {
      id: 2,
      name: "John Doe",
      location: "Office 2B",
      status: "Active",
      lastUpdate: "2023-12-02",
    },
  ]);
  const [pendingItems, setPendingItems] = useState([
    {
      id: 3,
      name: "Product B",
      location: "Store 1",
      status: "Pending Review",
      lastUpdate: "2023-12-03",
    },
    {
      id: 4,
      name: "Jane Smith",
      location: "Office 3C",
      status: "Pending Review",
      lastUpdate: "2023-12-03",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const addNewItem = (item) => {
    setPendingItems([
      ...pendingItems,
      {
        ...item,
        id: items.length + pendingItems.length + 1,
        status: "Pending Review",
        lastUpdate: new Date().toISOString().split("T")[0],
      },
    ]);
    setShowForm(false);
  };

  const approveItem = (item) => {
    setItems([...items, { ...item, status: "Active" }]);
    setPendingItems(pendingItems.filter((i) => i.id !== item.id));
  };

  const rejectItem = (itemId) => {
    setPendingItems(pendingItems.filter((item) => item.id !== itemId));
  };

  const updateItem = (updatedItem) => {
    setItems(
      items.map((item) =>
        item.id === updatedItem.id
          ? {
              ...updatedItem,
              lastUpdate: new Date().toISOString().split("T")[0],
            }
          : item
      )
    );
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Location Tracker</h1>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Entry
          </button>
        </div>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`px-4 py-2 rounded ${
            isAdmin
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white`}
        >
          {isAdmin ? "Exit Admin" : "Admin Mode"}
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        {showForm ? (
          <AddItemForm
            onSubmit={addNewItem}
            onCancel={() => setShowForm(false)}
          />
        ) : editingItem ? (
          <AddItemForm
            onSubmit={updateItem}
            onCancel={() => setEditingItem(null)}
            initialData={editingItem}
          />
        ) : isAdmin ? (
          <AdminPanel
            items={items}
            pendingItems={pendingItems}
            onApprove={approveItem}
            onReject={rejectItem}
            onEdit={setEditingItem}
          />
        ) : (
          <ItemList items={items} />
        )}
      </main>
    </div>
  );
}

function AdminPanel({ items, pendingItems, onApprove, onReject, onEdit }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500"
            >
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <div className="mt-2 text-gray-600">
                <p>Location: {item.location}</p>
                <p>Status: {item.status}</p>
                <p className="text-sm">Last Updated: {item.lastUpdate}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onApprove(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Existing Items</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <div className="mt-2 text-gray-600">
                <p>Location: {item.location}</p>
                <p>Status: {item.status}</p>
                <p className="text-sm">Last Updated: {item.lastUpdate}</p>
              </div>
              <button
                onClick={() => onEdit(item)}
                className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItemList({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <div className="mt-2 text-gray-600">
            <p>Location: {item.location}</p>
            <p>Status: {item.status}</p>
            <p className="text-sm">Last Updated: {item.lastUpdate}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddItemForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      location: "",
      status: "Active",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default App;
