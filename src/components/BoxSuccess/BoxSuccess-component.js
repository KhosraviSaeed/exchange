import React from "react";

import Typography from "../Typography";
import Box from "../Box";

function BoxSuccess(props) {
  return (
    <Box bg="success.main" py={2} px={4} borderRadius="s">
      <Typography textAlign="center" as="div">
        {props.children}
      </Typography>
    </Box>
  );
}

export default BoxSuccess;
