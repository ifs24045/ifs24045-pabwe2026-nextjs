const apiHelper = (() => {
  async function fetchData(url: string, options: RequestInit = {}) {
    const urlQuery = url.includes("?") ? url.split("?")[1] : "";
    const urlWithoutQuery = url.replace(`?${urlQuery}`, "");

    const fixUrl = urlWithoutQuery.endsWith("/")
      ? urlWithoutQuery.slice(0, -1)
      : urlWithoutQuery;

    const fullUrl = fixUrl + (urlQuery ? `?${urlQuery}` : "");

    const token = getAccessToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(fullUrl, {
      ...options,
      mode: "cors",
      headers,
    });
  }

  function putAccessToken(token: string | null | undefined) {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  return {
    fetchData,
    putAccessToken,
    getAccessToken,
  };
})();

export default apiHelper;