export const sendMessage = async (message: string) => {
  const response = await fetch(
    "https://dualmind-orchestration.onrender.com/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    throw new Error("Network Error");
  }

  return response.json();
};
