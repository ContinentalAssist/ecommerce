/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { useState, useEffect } from 'react';
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
  required?: boolean; // ← NUEVO: Para validación
  [key: string]: any;
}

type DateRange = [Dayjs | null, Dayjs | null];

const MyDateRangePicker = (props: DateRangePickerProps) => {
  const getValidDateOrDefault = (dateString?: string): Dayjs | undefined => {
    if (!dateString) return undefined;
    // Intentar parsear la fecha en múltiples formatos
    const formats = ['YYYY/MM/DD', 'YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'];
    for (const format of formats) {
      const date = dayjs(dateString, format);
      if (date.isValid()) return date;
    }
    return undefined;
  };

  const toNullIfUndefined = (date: Dayjs | undefined): Dayjs | null => {
    return date === undefined ? null : date;
  };

  const [value, setValue] = useState<DateRange>(() => {
    let startDate: Dayjs | null = null;
    let endDate: Dayjs | null = null;
    
    if (props.defaultvalue) {
      if (typeof props.defaultvalue === 'object') {
        const start = getValidDateOrDefault(props.defaultvalue.start);
        const end = getValidDateOrDefault(props.defaultvalue.end);
        startDate = toNullIfUndefined(start);
        endDate = toNullIfUndefined(end);
      } else if (typeof props.defaultvalue === 'string' && props.defaultvalue.includes('-')) {
        // Si es un string con formato "start - end"
        const [start, end] = props.defaultvalue.split('-').map(s => s.trim());
        startDate = toNullIfUndefined(getValidDateOrDefault(start));
        endDate = toNullIfUndefined(getValidDateOrDefault(end));
      }
    } else if (props.defaultStartValue || props.defaultEndValue) {
      const start = getValidDateOrDefault(props.defaultStartValue);
      const end = getValidDateOrDefault(props.defaultEndValue);
      startDate = toNullIfUndefined(start);
      endDate = toNullIfUndefined(end);
    }

    // Asegurarse de que los valores sean válidos y estén en el formato correcto
    if (startDate) {
      startDate = dayjs(startDate);
    }
    if (endDate) {
      endDate = dayjs(endDate);
    }
    
    return [startDate, endDate];
  });

  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  
  // ← NUEVO: Estados de validación
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [hasValue, setHasValue] = useState(false);

  // ← NUEVO: Función para validar si el rango está completo
  const validateDateRange = (dateRange: DateRange): boolean => {
    return dateRange[0] !== null && dateRange[1] !== null;
  };

  // ← NUEVO: Efecto para actualizar estados de validación
  useEffect(() => {
    const isComplete = validateDateRange(value);
    setHasValue(isComplete);
    
    if (props.required) {
      setIsValid(isComplete);
    } else {
      setIsValid(isComplete || (!value[0] && !value[1]) ? true : null);
    }
  }, [value, props.required]);

  const formatDateRange = (dateRange: DateRange) => {
    return {
      start: dateRange[0] ? dateRange[0].format('YYYY/MM/DD') : '',
      end: dateRange[1] ? dateRange[1].format('YYYY/MM/DD') : ''
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
    } else if (props.onChange) {
      // Si el rango está incompleto, enviar valores vacíos
      props.onChange({ start: '', end: '' });
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

  // ← NUEVO: Clases de validación dinámicas
  const getValidationClasses = () => {
    if (isValid === true) return 'is-valid';
    if (isValid === false) return 'is-invalid';
    return '';
  };

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
              required={props.required} // ← NUEVO
              error={isValid === false} // ← NUEVO
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
                readOnly: true,
                className: getValidationClasses(), // ← NUEVO
              }}
              sx={{
                '& .MuiInputBase-input': {
                  cursor: 'pointer',
                },
                // ← NUEVO: Estilos de validación
                ...(isValid === true && {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#28a745',
                    },
                  },
                }),
                ...(isValid === false && {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#dc3545',
                    },
                  },
                }),
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
                  required: props.required, // ← NUEVO
                  error: isValid === false, // ← NUEVO
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
                    className: getValidationClasses(), // ← NUEVO
                  },
                  // ← NUEVO: Estilos de validación para desktop
                  sx: {
                    ...(isValid === true && {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#28a745',
                        },
                      },
                    }),
                    ...(isValid === false && {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#dc3545',
                        },
                      },
                    }),
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
          
          {/* ← NUEVO: Input oculto para la validación del formulario */}
          <input
            type="hidden"
            id={props.id}
            name={props.id}
            className={`form-control form-date-range ${getValidationClasses()}`}
            value={formatDateRangeForDisplay(value)}
            required={props.required}
            data-start={value[0] ? value[0].format('YYYY/MM/DD') : ''}
            data-end={value[1] ? value[1].format('YYYY/MM/DD') : ''}
          />
          
          {/* Inputs ocultos para los formularios */}
          {startName && (
            <input
              type="hidden"
              name={startName}
              value={value[0] ? value[0].format('YYYY/MM/DD') : ''}
            />
          )}
          {endName && (
            <input
              type="hidden"
              name={endName}
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