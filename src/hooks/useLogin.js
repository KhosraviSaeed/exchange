import { useState } from "react";
import { useDispatch } from "react-redux";
import { navigate } from "@reach/router";
// import { useToasts } from "react-toast-notifications";

import { login } from "../ducks/user/user-api";
import { setProfileByLoginAction } from "../ducks/user/user-actions";
import { LINK_DASHBOARD } from "../configs/constants-config";

function useLogin() {
//   let { addToast } = useToasts();
  let [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  function doLogin({ username, password, preLocation }) {
    setLoading(true);
    return login({ username, password, preLocation })
      .then(response => {
        dispatch(setProfileByLoginAction(response.data.data));
        if (!!preLocation) {
          navigate(preLocation)
        } else {
          navigate(LINK_DASHBOARD);
        }
      })
      .catch(({ response }) => {
        let errorMessage =
          response?.data?.metaData?.message || "مشکلی پیش آمده است.";
        let code = response?.data?.metaData?.clientErrorCode;
        // if (code === 17) {
        //   addToast(errorMessage, {
        //     appearance: "error",
        //     notification: {
        //       message:
        //         "در صورتی که هنوز ایمیل تایید را دریافت نکرده‌اید دوباره درخواست دهید."
        //     }
        //   });
        //   navigate(LINK_RESEND_EMAIL, {state: { username: username } });
        // } else if (code === 18) {
        //   addToast(errorMessage, {
        //     appearance: "error",
        //     notification: {
        //       message:
        //         "در صورتی که هنوز کد راستی آزمایی را دریافت نکرده‌اید دوباره درخواست دهید."
        //     }
        //   });
        //   navigate(LINK_RESEND_PHONE_CODE, {state: { username: username } });
        // } else {
        //   addToast(errorMessage, { appearance: "error" });
        // }
      })
      .finally(() => setLoading(false));
  }

  return {
    login: doLogin,
    loading
  };
}

export default useLogin;