export class FetchRpcClient {
  async callRPC(methodName, params) {
    const response = await fetch(`/rpc/${methodName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // Fetching text instead of json to avoid errors in case of non-JSON responses
      console.log(
        `RPC call failed with status ${response.status}: ${errorBody}`
      );
      throw new Error(`RPC call failed: ${response.status}: ${errorBody}`);
    }

    return await response.json();
  }
}
