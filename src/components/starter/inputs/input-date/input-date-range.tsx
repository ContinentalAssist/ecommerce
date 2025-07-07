/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { useState } from 'react';
import { LicenseInfo } from '@mui/x-license';
LicenseInfo.setLicenseKey('5b3cb478e2a50cc92ccd56254e4eb447Tz0xMTU2NDAsRT0xNzgzMjA5NTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI=');
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
  defaultvalue?: { start: string; end: string } | string;
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
      start: dateRange[0] ? dateRange[0].format('YYYY/MM/DD') : '',
      end: dateRange[1] ? dateRange[1].format('YYYY/MM/DD') : ''
    };
  };

  const handleDateRangeChange = (newValue: DateRange) => {
    setValue(newValue);
    if (newValue[0] && newValue[1]) {
      const formatted = formatDateRange(newValue);
      props.onChange && props.onChange(formatted);
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
                width: '100%',
                '& .MuiDateRangePickerInput-root': {
                  gap: '8px'
                }
              }}
              onChange={handleDateRangeChange}
            />
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