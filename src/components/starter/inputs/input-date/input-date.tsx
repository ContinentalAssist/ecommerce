/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { useState, useEffect, useRef, FocusEvent } from 'react';

import { LicenseInfo } from '@mui/x-license';

// Configurar la licencia usando variable de entorno
const MUI_X_LICENSE_KEY = import.meta.env.VITE_MUI_X_LICENSE_KEY;

if (MUI_X_LICENSE_KEY) {
  LicenseInfo.setLicenseKey(MUI_X_LICENSE_KEY);
} else {
  console.warn('MUI X License key not found. Please set VITE_MUI_X_LICENSE_KEY environment variable.');
}

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Grid, Box, InputAdornment, createSvgIcon, TextField } from "@mui/material";
import dayjs from "../../../../utils/dayjs-config";
import type { Dayjs } from "dayjs";
import './input-date.css'

const CalendarIcon = createSvgIcon(
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
  name?: string;
  placeholder?: string;
  [key: string]: any;
}

const MyDatePicker = (props: DatePickerProps) => {
  const getValidDateOrDefault = (dateString?: string): Dayjs | undefined => {
    if (!dateString) return undefined;
    const date = dayjs(dateString);
    return date.isValid() ? date : undefined;
  };

  const toNullIfUndefined = (date: Dayjs | undefined): Dayjs | null => {
    return date === undefined ? null : date;
  };

  const [value, setValue] = useState<Dayjs | null>(() => {
    const defaultDate = getValidDateOrDefault(props.defaultvalue);
    return toNullIfUndefined(defaultDate);
  });

  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
   const popperRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (newValue: Dayjs | null, context: any) => {
    setValue(newValue);
    if (context.validationError === null && newValue) {
      const formatted = newValue.format('YYYY/MM/DD');
      props.onChange && props.onChange(formatted);
    }
  };

  const formatDate = (date: Dayjs | null): string => {
    return date ? date.format('YYYY/MM/DD') : '';
  };

  const handleMobileInputClick = () => {
    setOpenMobile(true);
    props.onFocus && props.onFocus(true);
  };

  const handleMobileClose = () => {
    setOpenMobile(false);
    props.onFocus && props.onFocus(false);
  };

   // useEffect para escuchar cambios en props.defaultvalue
  useEffect(() => {
    const newValue = getValidDateOrDefault(props.defaultvalue);
    setValue(toNullIfUndefined(newValue));
  }, [props.defaultvalue]);

  // Filtrar solo las props que son válidas para los date pickers de MUI
  const getDatePickerProps = () => {
    const allowedProps = [
      'disabled',
      'readOnly',
      'format',
      'views',
      'openTo',
      'orientation',
      'closeOnSelect',
      'disableFuture',
      'disablePast',
      'shouldDisableDate',
      'shouldDisableMonth',
      'shouldDisableYear',
      'dayOfWeekFormatter',
      'localeText',
      'timezone',
      'hidden'
    ];
    
    const filteredProps: any = {};
    allowedProps.forEach(prop => {
      if (props[prop] !== undefined) {
        filteredProps[prop] = props[prop];
      }
    });
    
    return filteredProps;
  };

  const datePickerProps = getDatePickerProps();

  return (
    <div>
      <Grid key={'key-' + props.id} item xs={12} sm={12} lg={12} sx={{display: props.hidden ? 'none' : 'block'}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Mobile Date Picker */}
          <Box display={{ lg: "none", md: "none", sm: "none", xs: "block" }}>
            {/* Input visual único para mobile */}
            <TextField
              fullWidth
              label={props.label}
              placeholder={props.placeholder || 'Selecciona una fecha'}
              value={formatDate(value)}
              onClick={handleMobileInputClick}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  cursor: 'pointer',
                },
              }}
            />
            
            {/* MobileDatePicker oculto - solo para la funcionalidad */}
            <MobileDatePicker
              {...datePickerProps}
              value={value}
              open={openMobile}
              onOpen={() => setOpenMobile(true)}
              onClose={handleMobileClose}
              minDate={getValidDateOrDefault(props.min)}
              maxDate={getValidDateOrDefault(props.max)}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  sx: { display: 'none' } // Ocultar el input original
                },
              }}
            />
          </Box>

          {/* Desktop Date Picker */}
          <Box display={{ xs: "none", sm: "block" }}>
            <DesktopDatePicker
              {...datePickerProps}
              label={props.label}
              value={value}
              open={openDesktop}
              closeOnSelect={true}
              onClose={() => setOpenDesktop(false)}
              minDate={getValidDateOrDefault(props.min)}
              maxDate={getValidDateOrDefault(props.max)}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon /> 
                    </InputAdornment>
                  ),
                  endAdornment: null,
                },
                  inputProps: {
                    onFocus: (event: FocusEvent<HTMLInputElement>) => {
                      if (!popperRef.current?.contains(event.relatedTarget as Node)) {
                        setOpenDesktop(true);
                      }
                    },
                    onClick: () => {
                      setOpenDesktop(true);
                    },
                    readOnly: true,
                  },
                },
                popper: {
                  ref: popperRef,
                },
              }}
              sx={{ width: '100%' }}
            />
          </Box>  

          {/* Input oculto para formularios */}
          {props.name && (
            <input
              type="hidden"
              name={props.name}
              value={value ? value.format('YYYY/MM/DD') : ''}
            />
          )}
        </LocalizationProvider>
      </Grid>
    </div>
  );
};

export const DatePickerMUI = qwikify$(
  MyDatePicker, {
  eagerness: "visible",
});