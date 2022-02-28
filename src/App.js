import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import lodash from "lodash";
import "./App.css";

const App = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formFields, setFormFields] = useState([]);

  const renderFormField = (formField) => {
    switch(formField.type) {
      case "select":
        return (
          <TextField
            id={formField.fieldName}
            select
            label={lodash.startCase(formField.fieldName)}
            value={formField.value}
            variant="filled"
          >
            {formField.options.map((option) => (
              <MenuItem key={option} value={option}>{lodash.startCase(option)}</MenuItem>
            ))}
          </TextField>
        )
      case "multiline":
        return (
          <TextField
            id={formField.fieldName}
            multiline
            type={formField.type}
            label={lodash.startCase(formField.fieldName)}
            value={formField.value}
            variant="filled"
          />
        )
      default:
        return (
          <TextField
            id={formField.fieldName}
            type={formField.type}
            label={lodash.startCase(formField.fieldName)}
            value={formField.value}
            variant="filled"
          />
        )
    }
  }

  useEffect(() => {
    fetch("https://vb-react-exam.netlify.app/api/form")
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setFormFields(data.data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
      >
        {formFields.map((formField) => (
          <div>
            {renderFormField(formField)}
          </div>
        ))}
        <Button variant="contained">
          Submit
        </Button>
      </Box>
    );
  }
};

export default App;
