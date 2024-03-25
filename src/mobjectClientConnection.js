async function callRPC(methodName, params) {
  try {
    console.log("ted");
    const response = await fetch(`/rpc/${methodName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`RPC call failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling RPC:", error);
    throw error;
  }
}
