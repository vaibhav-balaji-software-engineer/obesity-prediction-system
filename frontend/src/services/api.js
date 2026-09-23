const API_URL = import.meta.env.VITE_API_URL;

export const predictObesity = async (data) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Prediction failed");
  }

  return result;
};