/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { useState } from 'react';
import { LicenseInfo } from '@mui/x-license';

// Configurar la licencia usando variable de entorno
const MUI_X_LICENSE_KEY = import.meta.env.VITE_MUI_X_LICENSE_KEY;

if (MUI_X_LICENSE_KEY) {
  LicenseInfo.setLicenseKey(MUI_X_LICENSE_KEY);
} else {
  console.warn('MUI X License key not found. Please set VITE_MUI_X_LICENSE_KEY environment variable.');
}

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDateRangePicker, MobileDateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { Grid, Box, InputAdornment, createSvgIcon, TextField } from "@mui/material";
import dayjs from "../../../../utils/dayjs-config";
import type { Dayjs } from "dayjs";
import './input-date.css'

const CalendarIcon = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path>,
  'CalendarIcon',
);

interface DateRangePickerProps {
  id?: string;
  label?: string;
  defaultStartValue?: string;
  defaultEndValue?: string;
  defaultvalue?: { start: string; end: string } | string;
  min?: string;
  max?: string;
  onChange?: (dateRange: { start: string; end: string }) => void;
  onFocus?: (isOpen: boolean) => void;
  startName?: string;
  endName?: string;
  placeholder?: string;
  [key: string]: any;
}

type DateRange = [Dayjs | null, Dayjs | null];

const MyDateRangePicker = (props: DateRangePickerProps) => {
  const getValidDateOrDefault = (dateString?: string): Dayjs | undefined => {
    if (!dateString) return undefined;
    const date = dayjs(dateString);
    return date.isValid() ? date : undefined;
  };

  const toNullIfUndefined = (date: Dayjs | undefined): Dayjs | null => {
    return date === undefined ? null : date;
  };

  const [value, setValue] = useState<DateRange>(() => {
    let startDate: Dayjs | null = null;
    let endDate: Dayjs | null = null;
    
    if (props.defaultvalue && typeof props.defaultvalue === 'object') {
      const start = getValidDateOrDefault(props.defaultvalue.start);
      const end = getValidDateOrDefault(props.defaultvalue.end);
      startDate = toNullIfUndefined(start);
      endDate = toNullIfUndefined(end);
    } else {
      const start = getValidDateOrDefault(props.defaultStartValue);
      const end = getValidDateOrDefault(props.defaultEndValue);
      startDate = toNullIfUndefined(start);
      endDate = toNullIfUndefined(end);
    }
    
    return [startDate, endDate];
  });

  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const formatDateRange = (dateRange: DateRange) => {
    return {
      start: dateRange[0] ? dateRange[0].format('MM/DD/YYYY') : '',
      end: dateRange[1] ? dateRange[1].format('MM/DD/YYYY') : ''
    };
  };

  // Función para formatear el rango de fechas para mostrar en el input
  const formatDateRangeForDisplay = (dateRange: DateRange): string => {
    if (!dateRange[0] || !dateRange[1]) return '';
    const formatted = formatDateRange(dateRange);
    return `${formatted.start} - ${formatted.end}`;
  };

  const handleDateRangeChange = (newValue: DateRange) => {
    setValue(newValue);
    if (newValue[0] && newValue[1]) {
      const formatted = formatDateRange(newValue);
      props.onChange && props.onChange(formatted);
    }
  };

  const handleMobileInputClick = () => {
    setOpenMobile(true);
    props.onFocus && props.onFocus(true);
  };

  const handleMobileClose = () => {
    setOpenMobile(false);
    props.onFocus && props.onFocus(false);
  };

  // Nombres por defecto para los inputs ocultos
  const startName = props.startName || "Desde";
  const endName = props.endName || "Hasta";

  return (
    <div>
      <Grid key={'key-' + props.id} item xs={12} sm={12} lg={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Mobile Date Range Picker */}
          <Box display={{ lg: "none", md: "none", sm: "none", xs: "block" }}>
            {/* Input visual único para mobile */}
            <TextField
              fullWidth
              label={props.label}
              placeholder={props.placeholder || 'Selecciona el rango de fechas'}
              value={formatDateRangeForDisplay(value)}
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
            
            {/* MobileDateRangePicker oculto - solo para la funcionalidad */}
            <MobileDateRangePicker
              {...props}
              value={value}
              open={openMobile}
              onOpen={() => setOpenMobile(true)}
              onClose={handleMobileClose}
              minDate={getValidDateOrDefault(props.min)}
              maxDate={getValidDateOrDefault(props.max)}
              onChange={handleDateRangeChange}
              localeText={{
                start: "Desde",
                end: "Hasta"
              }}
              slotProps={{
                textField: {
                  sx: { display: 'none' } // Ocultar el input original
                },
              }}
              sx={{
                '& .MuiMultiInputDateRangeField-separator': {
                  display: 'none',
                },
                '& .MuiTypography-root.MuiMultiInputDateRangeField-separator': {
                  display: 'none',
                },
              }}
            />
          </Box>

          {/* Desktop Date Range Picker */}
          <Box display={{ xs: "none", sm: "block" }}>
            <DesktopDateRangePicker
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
              localeText={{
                start: "Desde",
                end: "Hasta"
              }}
              slotProps={{
                textField: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon />
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
              sx={{
                '& .MuiMultiInputDateRangeField-separator': {
                  display: 'none',
                },
                '& .MuiTypography-root.MuiMultiInputDateRangeField-separator': {
                  display: 'none',
                },
              }}
              onChange={handleDateRangeChange}
            />
          </Box>
          
          {/* Inputs ocultos para los formularios */}
          {startName && (
            <input
              type="hidden"
              name={startName}
              value={value[0] ? value[0].format('MM/DD/YYYY') : ''}
            />
          )}
          {endName && (
            <input
              type="hidden"
              name={endName}
              value={value[1] ? value[1].format('MM/DD/YYYY') : ''}
            />
          )}
        </LocalizationProvider>
      </Grid>
    </div>
  );
};

export const DateRangePickerMUI = qwikify$(
  MyDateRangePicker, {
  eagerness: "visible",
});