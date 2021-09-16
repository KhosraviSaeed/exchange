import React from "react";
// import { Helmet } from "react-helmet";

import qs from "query-string";

// import { LayoutAuth } from "../Layouts/Auth";
// import Box from "../components/Box";
import LoginForm from "../Layouts/Auth/LoginForm";
// import BoxSuccess from "../components/BoxSuccess";
// import Divider from "../components/Divider";


function Login(props) {

  return (
    //   <LayoutAuth desc="لطفا نام کاربری و کلمه عبور خود را وارد کنید:">
    //   {/* <Helmet>
    //     <title>{generate_title("صفحه ورود")}</title>
    //   </Helmet> */}
    //   {m === "1" && (
    //     <>
    //       <BoxSuccess>ایمیل شما با موفقیت تایید شد. وارد شوید.</BoxSuccess>
    //       <Divider mb={4} />
    //     </>
    //   )}
      <LoginForm />
    //   <Box mt={7} display="flex " flexDirection="column" alignItems="center">
    //     <div>هنوز حساب کاربری ندارید؟</div>
    //     {/* <Link to="/register">حساب جدید</Link> */}
    //   </Box>
    // </LayoutAuth>
  )
}

export default Login;