import React, { useEffect, useState } from 'react';
import { Select } from '@chakra-ui/react';

const Response = (props) => {
  const [resp, setResp] = useState(null);
  const [options, setOptions] = useState([]);

  const handleChange = (e) => {
    setResp(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    if(props.field_type == "Multiple Choice" || props.field_type == "Expense")
    {
    const fetchChoices = async () => {
      const config = {
        appName: "smart-joules-app",
        reportName: "All_Tasks",
        criteria: `Maintanance_ID == ${props.master_id} && Task_Name == "${props.task}"`,
      };
      try {
        await ZOHO.CREATOR.init();
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        const tasks = response.data[0].Choices.map((choice) => ({
          value: choice.display_value,
          text: choice.ID,
        }));
        setOptions(tasks);
      } catch (err) {
        console.error("Error fetching choices:", err);
      }
    };

    fetchChoices();
  }
  }, [props.master_id, props.task]);

  return (
    <>
      {props.field_type === "Multiple Choice" ||
      props.field_type === "Expense" ||
      props.field_type === "Consumption" ? (
        <Select placeholder="Select option" onChange={handleChange}>
          {options.map((option, index) => (
            <option value={option.text} key={index}>
              {option.value}
            </option>
          ))}
        </Select>
      ) : props.field_type === "Number" || props.field_type === "Meter Reading" ? (
        <input
          type="number"
          className="form-control"
          onChange={handleChange}
        />
      ) : (
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default Response;
