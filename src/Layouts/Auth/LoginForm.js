import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Link } from "@reach/router";

// import { TextLineInput, PasswordLineInput } from "../../components/TextInput";
// import Button from "../../components/Button";
import Divider from "../../components/Divider";
import Box from "../../components/Box";
// import Checkbox from "../../components/Checkbox/Checkbox-component";
// import { loginFormValidation, isUsernameValid } from "../../helpers/validations";
import useLogin from "../../hooks/useLogin";

function LoginForm(props) {
//   let { addToast } = useToasts();
  let { login, loading: loggingIn } = useLogin();

  let [username, setUsername] = useState(props.username? props.username : '');
  let [password, setPassword] = useState("");

//   let formValidation = loginFormValidation({ username, password });
//   let isValid = isUsernameValid(username);
//   let iconUsernameInput = null;
//   if (username !== "") {
//     iconUsernameInput = isValid ? "successful" : "failed";
//   }
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        // if (!formValidation.isValid) return;
        login({ username: username, password, preLocation: props.preLocation });
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <input
          name="usernaem"
          placeholder="رایانامه یا شماره موبایل"
          defaultValue={username}
          onChange={e => setUsername(e.target.value)}
        //   rightIcon={<img src="/svgs/mail.svg" alt="mail icon" />}
        //   leftIcon={
        //     iconUsernameInput && (
        //       <img src={`/svgs/${iconUsernameInput}.svg`} alt="status icon" />
        //     )
        //   }
        />
        <Divider mt={5} />
        <input
          key="password"
          placeholder="گذرواژه"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullwidth
        />
        <Divider mt={6} />
        {/* <Box display="flex" justifyContent="space-between" width="100%">
          <Checkbox
            id="remember"
            // onChange={checkBoxOnChange}
          >
            یادآوری
          </Checkbox>
          <Link to="/forgot">فراموش کردی؟</Link>
        </Box> */}

        <Divider mt={6} />
        <button
        //   disabled={!formValidation.isValid || loggingIn}
        //   onDisabled={() => {
        //     addToast(formValidation.message, {
        //       appearance: "error",
        //       notification: {
        //         message:"ورودی ها صحیح نمی باشند"
        //       }
        //     });
        //   }}
        //   bg="white"
        //   type="rounded"
        //   light
        >
          ورود به حساب کاربری
          <img src={`/svgs/arrow-left.svg`} alt="" className="left" />
        </button>
      </Box>
    </form>
  );
}

export default LoginForm;