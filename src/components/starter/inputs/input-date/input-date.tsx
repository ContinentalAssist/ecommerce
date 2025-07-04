/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { useState } from 'react';
import { LicenseInfo } from '@mui/x-license';
LicenseInfo.setLicenseKey('5b3cb478e2a50cc92ccd56254e4eb447Tz0xMTU2NDAsRT0xNzgzMjA5NTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI=');
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker, MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { Grid, Box, InputAdornment, createSvgIcon } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import './input-date.css'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

const FlightLandIcon = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path>,
  'CalendarIcon',
);

interface DatePickerProps {
  id?: string;
  label?: string;
  defaultvalue?: string;
  min?: string;
  max?: string;
  onChange?: (date: string) => void;
  onFocus?: (isOpen: boolean) => void;
  [key: string]: any;
}

const MyDateTimePicker = (props: DatePickerProps) => {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  // Función para obtener fecha válida o null
  const getValidDateOrDefault = (dateString?: string): Dayjs | null => {
    if (!dateString) return null;
    const date = dayjs(dateString);
    return date.isValid() ? date : null;
  };

  return (
    <div>
      <Grid key={'key-' + props.id} item xs={12} sm={12} lg={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Mobile Date Picker */}
          <Box display={{ lg: "none", md: "none", sm: "none", xs: "block" }}>
            <MobileDatePicker
              {...props}
              label={props.label}
              value={value}
              open={openMobile}
              onOpen={() => setOpenMobile(true)}
              onClose={() => setOpenMobile(false)}
              minDate={getValidDateOrDefault(props.min)}
              maxDate={getValidDateOrDefault(props.max)}
              slotProps={{
                textField: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightLandIcon />
                      </InputAdornment>
                    ),
                    inputProps: {
                      onClick: (event) => {
                        event.stopPropagation();
                        setOpenMobile(true);
                      },
                    },
                  },
                },
              }}
              sx={{ width: '100%' }}
              onChange={(newValue) => {
                setValue(newValue);
                if (newValue) {
                  props.onChange && props.onChange(newValue.format('YYYY/MM/DD'));
                }
              }}
            />
          </Box>

          
          <Box display={{ xs: "none", sm: "block" }}>
            <DatePicker
              {...props}
              label={props.label}
              value={value}
              open={openDesktop}
              onOpen={() => {
                setOpenDesktop(true);
                props.onFocus && props.onFocus(true);
              }}
              onClose={() => {
                setOpenDesktop(false);
                props.onFocus && props.onFocus(false);
              }}
              minDate={getValidDateOrDefault(props.min)}
              maxDate={getValidDateOrDefault(props.max)}
              slotProps={{
                textField: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightLandIcon />
                      </InputAdornment>
                    ),
                    inputProps: {
                      onClick: () => {
                        setOpenDesktop(!openDesktop);
                        props.onFocus && props.onFocus(!openDesktop);
                      },
                    },
                  },
                },
              }}
              sx={{ width: '100%' }}
              onChange={(newValue) => {
                setValue(newValue);
                if (newValue) {
                  props.onChange && props.onChange(newValue.format('YYYY/MM/DD'));
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Grid>
    </div>
  );
};

export const DatePickerMUI = qwikify$(
  MyDateTimePicker, {
  eagerness: "visible",
});