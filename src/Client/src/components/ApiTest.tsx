import { Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useServices } from "../ServiceContextProvider";
import { useErrorHandledQuery } from "../services/useErrorHandledQuery";

export const ApiTest = () => {
  const { test } = useServices();

  const [runQuery, setRunQuery] = useState(false);

  const forecastQuery = useErrorHandledQuery({
    ...test.fetchDataQueryConfig(),
    enabled: runQuery,
  });

  const authData = useContext(AuthContext);

  return (
    <Box pt={2}>
      {!runQuery && (
        <>
          <Button variant="contained" onClick={() => setRunQuery(true)}>
            Api Call
          </Button>
        </>
      )}
      {JSON.stringify(forecastQuery.data)}
      <hr />
      {JSON.stringify(authData)}
    </Box>
  );
};
