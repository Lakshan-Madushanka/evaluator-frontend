import axios from "axios";
import moment from "moment/moment";
import router from "./router/index";
import { useAppStore } from "./stores/app";
import { useAuthStore } from "./stores/auth";

export const baseURL = "http://localhost:8000/";
export const baseApiURL = "http://localhost:8000/api/v1/";

const instance = axios.create({
  baseURL: baseApiURL,
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    console.log("heet", response.data);
    return response.data ? response.data : response;
  },
  function (error) {
    if (error.response) {
      if (parseInt(error.response.status) === 422) {
        return Promise.reject(error.response.data);
      }
      handleServerSideErrors(error);
      throw error.response;
    } else {
      handleClientSideErrors(error);
      throw error;
    }
  }
);

function handleClientSideErrors(errorResponse) {
  router.push({
    name: "error",
    query: {
      status: errorResponse.code,
      message: errorResponse.message,
      type: "client",
    },
  });
}
function handleServerSideErrors(errorResponse) {
  const appStore = useAppStore();
  const authStore = useAuthStore();

  const response = errorResponse.response;

  let status = parseInt(response.status);
  let message =
    response.data && response.data.message ? response.data.message : "";

  // Setup message if not exists
  if (message === "") {
    switch (status) {
      case 404:
        message = "Content you requested was not found on the server.";
        break;
      case 403:
        message = "You dont seem to have permission to access this";
        break;
      default:
        message = "Server error has occurred please try again !";
        break;
    }
  }

  if (status === 401) {
    if (appStore.initialized) {
      if (appStore.authenticated) {
        appStore.status = "SESSION_EXPIRED";
        appStore.authenticated = false;
        authStore.resetState();
      }

      router.push({ name: "login" });
    }

    throw errorResponse;
  }

  let query = {
    status: status,
    statusText: response.statusText,
    message: message,
    type: "server",
  };

  if (status === 429) {
    let retryAfterSeconds = errorResponse["response"]["headers"]["retry-after"];
    query["retryAfter"] = moment().add(retryAfterSeconds, "seconds").unix();
  }

  router.push({
    name: "error",
    query,
  });
}

export default instance;
