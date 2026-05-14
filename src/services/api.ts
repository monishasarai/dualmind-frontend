const API_URL = import.meta.env.VITE_API_URL;

export async function sendMessage(message: string) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return response.json();
}