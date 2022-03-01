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
  const [isFormFrozen, setIsFormFrozen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [postResult, setPostResult] = useState({});
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    gender: "",
    age: 0,
    testimonial: ""
  });

  const storeData = (formFields) => {
    const fields = {};
    for (let field of formFields) {
      fields[field.fieldName] = field.value
    }
    setState(fields);
  };

  const postData = () => {
    fetch("https://vb-react-exam.netlify.app/api/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...state
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setPostResult(result)
        setIsFormFrozen(false);
      })
      .catch((err) => {
        setError(err);
      });
  }

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    if (postResult) {
      setPostResult({});
    }
    setState({
      ...state,
      [name]: value
    });
  }

  const handleSubmit = () => {
    setIsFormFrozen(true);
    postData();
  }

  const renderFormField = (formField) => {
    switch(formField.type) {
      case "select":
        return (
          <TextField
            name={formField.fieldName}
            select
            label={lodash.startCase(formField.fieldName)}
            value={state[formField.fieldName] || ""}
            variant="filled"
            onChange={handleChange}
            disabled={isFormFrozen}
            align="left"
          >
            {formField.options.map((option) => (
              <MenuItem key={option} value={option}>{lodash.startCase(option)}</MenuItem>
            ))}
          </TextField>
        )
      case "multiline":
        return (
          <TextField
            name={formField.fieldName}
            multiline
            type={formField.type}
            label={lodash.startCase(formField.fieldName)}
            value={state[formField.fieldName] || ""}
            variant="filled"
            onChange={handleChange}
            disabled={isFormFrozen}
            align="left"
          />
        )
      default:
        return (
          <TextField
            name={formField.fieldName}
            type={formField.type}
            label={lodash.startCase(formField.fieldName)}
            value={state[formField.fieldName] || ""}
            variant="filled"
            onChange={handleChange}
            disabled={isFormFrozen}
            align="left"
          />
        )
    }
  }

  useEffect(() => {
    fetch("https://vb-react-exam.netlify.app/api/form", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setIsLoaded(true);
          setFormFields(result.data);
          storeData(result.data);
        }
      })
      .catch((err) => {
        setIsLoaded(true);
        setError(err);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '100ch' },
          }}
          noValidate
        >
          <h1>Dynamic Form</h1>
          {formFields.map((formField) => (
            <div key={formField.fieldName}>
              {renderFormField(formField)}
            </div>
          ))}
          <Button variant="contained" onClick={handleSubmit} disabled={isFormFrozen}>
            Submit
          </Button>
          {Object.entries(postResult).length
            ?
              <div className="App-response" align="left">
                <h3>Response</h3>
                <p>{JSON.stringify(postResult)}</p>
              </div>
            :
              null
          }
        </Box>
      </div>
    );
  };
};

export default App;
