/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import {useEffect, useState } from 'react';
import { LicenseInfo } from '@mui/x-license';
LicenseInfo.setLicenseKey(import.meta.env.VITE_MY_PUBLIC_MUI_KEY);
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DesktopDateRangePicker, MobileDateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { Grid, Box, InputAdornment, createSvgIcon } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import './input-date.css'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

const CalendarIcon = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path>,
  'CalendarIcon',
);

interface DateRangePickerProps {
  id?: string;
  label?: string;
  defaultStartValue?: string;
  defaultEndValue?: string;
  defaultvalue?: [Dayjs,Dayjs] ;
  min?: string;
  max?: string;
  onChange?: (dateRange: { start: string; end: string }) => void;
  onFocus?: (isOpen: boolean) => void;
  startName?: string;
  endName?: string;
  [key: string]: any;
}

type DateRange = [Dayjs | null, Dayjs | null];

const MyDateRangePicker = (props: DateRangePickerProps) => {

  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [value, setValue] = useState<DateRange>([null, null]);

  const getValidDateOrDefault = (dateString?: string): Dayjs | undefined => {
    if (!dateString) return undefined;
    const date = dayjs(dateString);
    return date.isValid() ? date : undefined;
  };

/*   const toNullIfUndefined = (date: Dayjs | undefined): Dayjs | null => {
    return date === undefined ? null : date;
  }; */




  useEffect(() => {
     if (props.value && props.value[0] !== null && props.value[0] !==undefined) {
      

      const start = props.value[0] || null;  // Obtiene start o null
      const end = props.value[1] || null;      // Obtiene end o null
      setValue([dayjs(dayjs(start).format('YYYY-MM-DD')), dayjs(dayjs(end).format('YYYY-MM-DD'))]);  
    }
    
    }, [props.value]);
 

  const formatDateRange = (dateRange: DateRange) => {
    return {
      start: dateRange[0] ? dateRange[0].format('YYYY/MM/DD') : '',
      end: dateRange[1] ? dateRange[1].format('YYYY/MM/DD') : ''
    };
  };

  const handleDateRangeChange = (newValue: DateRange) => {
  if (newValue[0] && newValue[1]) {
    // Calcular diferencia en días
    const diffDays = newValue[1].diff(newValue[0], 'day');
    
    // Validar mínimo 3 días
    if (diffDays < 3) {
      // Ajustar automáticamente a 3 días si es menor
      const adjustedEnd = newValue[0].add(3, 'day');
      setValue([newValue[0], adjustedEnd]);
      props.onChange && props.onChange(formatDateRange([newValue[0], adjustedEnd]));
    } else {
      // Mantener la selección del usuario si es >= 3 días
      setValue(newValue);
      props.onChange && props.onChange(formatDateRange(newValue));
    }
  } else if (newValue[0]) {
    // Si solo cambia start, establecer end a start + 3 días
    const newEnd = newValue[0].add(3, 'day');
    setValue([newValue[0], newEnd]);
    props.onChange && props.onChange(formatDateRange([newValue[0], newEnd]));
  } else {
    // Manejar caso cuando se borran ambas fechas
    setValue(newValue);
  }
};


  return (
    <div>
      <Grid key={'key-' + props.id} item xs={12} sm={12} lg={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Mobile Date Range Picker */}
          <Box display={{ lg: "none", md: "none", sm: "none", xs: "block" }}>
            <MobileDateRangePicker
              {...props}
              label={props.label}
              localeText={{
                start: 'Desde',
                end: 'Hasta',
              }}
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
                        <CalendarIcon />
                      </InputAdornment>
                    ),
                    inputProps: {
                      onClick: (event) => {
                         event.stopPropagation();
                        setOpenMobile(true);
                        props.onFocus && props.onFocus(!openMobile);
                      },
                    },
                  },
                },
              }}
              sx={{ width: '100%' }}
              onChange={handleDateRangeChange}
            />
          </Box>

          {/* Desktop Date Range Picker */}
          <Box display={{ xs: "none", sm: "block"  ,lg: "block"}}>
            
          <Box display={{ xs: "none", sm: "block" }}>
            <DesktopDateRangePicker
              {...props}
              label={props.label}
              localeText={{
                start: 'Desde',
                end: 'Hasta',
              }}
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
                        <CalendarIcon />
                      </InputAdornment>
                    ),
                    inputProps: {
                      onClick: (event) => {
                         event.stopPropagation();
                        setOpenDesktop(!openDesktop);
                        props.onFocus && props.onFocus(!openDesktop);
                      },
                    },
                  },
                },
              }}
              sx={{ 
                width: '100%',
                '& .MuiDateRangePickerInput-root': {
                  gap: '8px'
                }
              }}
              onChange={handleDateRangeChange}
            />
          </Box>
          </Box>
          {props.startName && (
            <input
              type="hidden"
              name={props.startName}
              value={value[0] ? value[0].format('YYYY/MM/DD') : ''}
            />
          )}
          {props.endName && (
            <input
              type="hidden"
              name={props.endName}
              value={value[1] ? value[1].format('YYYY/MM/DD') : ''}
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