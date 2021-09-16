import React, { useEffect } from "react";
// import io from "socket.io-client";
import { useToasts } from "react-toast-notifications";
// import { SOCKET } from "../../configs/constants-config";

//  let socket = io(SOCKET);

function ProtectedRoute(props) {
  // const { addToast } = useToasts();
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("resize", forceUpdate);
  }, []);

  // useEffect(
  //   function () {
  //     function toastNotification(data) {
  //       let { title, message, logo, link } = data.metaData;

  //       addToast(title, {
  //         appearance: "success",
  //         notification: {
  //           message,
  //           logo,
  //           link,
  //         },
  //       });
  //     }
  //     // socket.on("transfer_asset", toastNotification);
  //     // socket.on("assign_asset", toastNotification);
  //     // socket.on("accept_user_offer", toastNotification);

  //     return () => {
  //       // socket.close();
  //     };
  //   },
  //   [] //[socket]
  // );

  return <props.render {...props} />;
}

export default ProtectedRoute;
