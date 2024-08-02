/** @jsxImportSource react */
import { qwikify$, } from "@builder.io/qwik-react";
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker,MobileDatePicker  } from "@mui/x-date-pickers";
import { Grid,Box } from "@mui/material";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import  './input-date.css'

dayjs.extend(utc);
dayjs.extend(timezone);



const MyDateTimePicker = (props: any) => {
  const [inputAttr, setinputAttr] = useState(
    {
      id: '',
      label: '',
      min: '' ,
      max: '',
    }
  )
  const [value,setValue]=useState('')
  //const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {

 /*    if (/mobile/i.test(navigator.userAgent)) {
      setIsMobile(true)
    }else{
      setIsMobile(false)

    } */
    // Aquí puedes agregar lógica adicional que se ejecute cuando las props cambien
    if (props.min) {
      setinputAttr(props)

    }
  }, [props]);

  return(
    <div>
      <Grid key={'key-'+props.id} item xs={12} sm={12} lg={12}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
    
        <Box display={{ lg: "none", md: "none", sm: "none", xs: "block" }}>
        <MobileDatePicker
            {...props}
            label= {inputAttr.label}
            minDate={getValidDateOrDefault(props.min)}
            maxDate={getValidDateOrDefault(props.max)}
            fullWidth
            slotProps={{ inputAdornment: { position: 'start' },
            textField: { InputProps: {
              inputProps: {
                dateformated: value
            },
             } } }}
            
            sx={{ width: '100%' }}

            onChange={(newValue)=>{
              setValue(dayjs(newValue).format('YYYY-MM-DD'));
              props.onChange(dayjs(newValue).format('YYYY/MM/DD'))
            }
           
            }
            value={getValidDateOrDefault(value)}
          />
        </Box>

        <Box display={{ xs: "none", sm: "block" }}>
        <DatePicker
            {...props}
            label= {inputAttr.label}
            defaultValue={getValidDateOrDefault(props.defaultvalue)}
            minDate={getValidDateOrDefault(props.min)}
            maxDate={getValidDateOrDefault(props.max)}
            fullWidth             
            slotProps={{ inputAdornment: { position: 'start' },
            textField: { InputProps: {
              inputProps: {
                dateformated: value
            },
             } } }}
            
             sx={{ width: '100%' }}
            
            onChange={(newValue)=>{
              setValue(dayjs(newValue).format('YYYY-MM-DD'));
              props.onChange(dayjs(newValue).format('YYYY/MM/DD'))
            }
           
            }
            value={getValidDateOrDefault(value)}
          />
        </Box>
      
    </LocalizationProvider>
    </Grid>
    </div>
    
  )
}

export const DatePickerMUI = qwikify$(
  MyDateTimePicker, {
  eagerness: "visible",
});


function getValidDateOrDefault(dateString?: string):any {
  const date = dayjs(dateString);

  if (dateString != undefined && dateString !='' && date.isValid()) {
    return date ; 
  }else{
    return  null
  }
}
