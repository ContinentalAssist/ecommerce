/** @jsxImportSource react */
import { qwikify$, } from "@builder.io/qwik-react";
import {  useState } from 'react';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker,MobileDatePicker,LocalizationProvider} from "@mui/x-date-pickers";
import { Grid,Box, InputAdornment,createSvgIcon} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import  './input-date.css'

dayjs.extend(utc);
dayjs.extend(timezone);

const FlightLandIcon = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path>,
  'CalendarIcon',
);

<svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CalendarIcon"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></svg>

const MyDateTimePicker = (props: any) => {

  const [value,setValue]=useState('')
  const [openDesktop,setOpenDesktop]=useState(false)
  const [openMobile,setOpenMobile]=useState(false)
  return(
    <div>
      <Grid key={'key-'+props.id} item xs={12} sm={12} lg={12}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
    
        <Box display={{ lg: "none", md: "none", sm: "none", xs: "block" }}>
        <MobileDatePicker
            {...props}
            label= {props.label}
            minDate={getValidDateOrDefault(props.min)}
            maxDate={getValidDateOrDefault(props.max)}
            //format="DD MMM YYYY"
            fullWidth
            /* slots={{InputAdornment:FlightLandIcon}} */
            autoFocus={true}
            open={openMobile}
            onOpen={() => setOpenMobile(true)}
            onClose={() => setOpenMobile(false)}
            slotProps={{
            inputAdornment: { position: 'start' },
            textField: { InputProps: {
              startAdornment: <InputAdornment position="start">
              <FlightLandIcon></FlightLandIcon>
              </InputAdornment>,
              inputProps: {
                dateformated: value,
                onClick: (event) => {
                  // Abre el calendario al hacer clic en el TextField
                  event.stopPropagation(); // Evita que el evento se propague
                  setOpenMobile(true)
                },
         
            },
             } } }}
            
            sx={{ width: '100%' }}
            //open={props?.open||false}
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
            label= {props.label}
            defaultValue={getValidDateOrDefault(props.defaultvalue)}
            autoFocus={true}
            open={openDesktop}
            onOpen={() => setOpenDesktop(true)}
            onClose={() => setOpenDesktop(false)}
            minDate={getValidDateOrDefault(props.min)}
            maxDate={getValidDateOrDefault(props.max)}
            fullWidth             
            slotProps={{ inputAdornment: { position: 'start' },
            textField: { InputProps: {
              inputProps: {
                dateformated: value,
                onClick: (event) => {
                  // Abre el calendario al hacer clic en el TextField
                  event.stopPropagation(); // Evita que el evento se propague
                  setOpenDesktop(true)
                  props.onFocus(true)
                },
            },
             } } }}
            
             sx={{ width: '100%' }}
            
            onChange={(newValue)=>{
              setValue(dayjs(newValue).format('YYYY-MM-DD'));
              props.onChange(dayjs(newValue).format('YYYY/MM/DD'))
            }
            }

            /* renderInput={(params:any) => {
              return (
                <TextField
                  {...params}
                  InputLabelProps={{
                    shrink: true
                  }}
                  onClick={(e) => setOpenDesktop(true)}
                  onChange={(newValue)=>{
                    console.log("change",newValue);
                    setOpenDesktop(false)
                  }}
                />
              );
            }} */
           
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
