/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { useState, useEffect } from 'react';
import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey('5b3cb478e2a50cc92ccd56254e4eb447Tz0xMTU2NDAsRT0xNzgzMjA5NTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI=');

import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DesktopDateRangePicker, MobileDateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { Grid, Box, InputAdornment, createSvgIcon, useMediaQuery, useTheme } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import 'dayjs/locale/es';
import './input-date.css'

// Configurar dayjs con todos los plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale('es');

const FlightLandIcon = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path>,
  'CalendarIcon',
);

interface DateRangePickerProps {
  id?: string;
  label?: string;
  placeholder?: string;
  defaultStartValue?: string;
  defaultEndValue?: string;
  min?: string;
  max?: string;
  onChange?: (dateRange: { start: string; end: string }) => void;
  onFocus?: (isOpen: boolean) => void;
  startName?: string;
  endName?: string;
  [key: string]: any;
}

// Tipo específico para MUI Date Pickers
type DateRange = [Dayjs | null, Dayjs | null];

const MyDateRangePicker = (props: DateRangePickerProps) => {
  const [value, setValue] = useState<DateRange>([null, null]);
  const [open, setOpen] = useState<boolean>(false);
  
  // Usar useMediaQuery para detectar si es mobile de forma reactiva
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Inicializar valores por defecto - mantenemos consistencia con null
  useEffect(() => {
    const startDate = props.defaultStartValue ? dayjs(props.defaultStartValue) : null;
    const endDate = props.defaultEndValue ? dayjs(props.defaultEndValue) : null;
    
    setValue([startDate, endDate]);
  }, [props.defaultStartValue, props.defaultEndValue]);

  const formatDateRange = (dateRange: DateRange): { start: string; end: string } => {
    return {
      start: dateRange[0] ? dateRange[0].format('YYYY/MM/DD') : '',
      end: dateRange[1] ? dateRange[1].format('YYYY/MM/DD') : ''
    };
  };

  // Handler con la firma correcta que espera el picker
  const handleDateRangeChange = (
    newValue: [Dayjs | null, Dayjs | null], 
    _context?: any
  ) => {
    setValue(newValue);
    const formatted = formatDateRange(newValue);
    
    // Actualizamos inputs ocultos si existen
    if (props.startName) {
      const startInput = document.querySelector(`input[name="${props.startName}"]`) as HTMLInputElement;
      if (startInput) startInput.value = formatted.start;
    }
    
    if (props.endName) {
      const endInput = document.querySelector(`input[name="${props.endName}"]`) as HTMLInputElement;
      if (endInput) endInput.value = formatted.end;
    }
    
    // Llamamos al callback si existe
    if (props.onChange) {
      props.onChange(formatted);
    }
  };

  // Función para obtener fechas min/max - retorna undefined para valores vacíos
  const getMinMaxDate = (dateString?: string): Dayjs | undefined => {
    if (!dateString) return undefined;
    const date = dayjs(dateString);
    return date.isValid() ? date : undefined;
  };

  // Handlers unificados para abrir/cerrar
  const handleOpen = () => {
    setOpen(true);
    if (props.onFocus) {
      props.onFocus(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (props.onFocus) {
      props.onFocus(false);
    }
  };

  const commonProps = {
    value: value as [Dayjs | null, Dayjs | null],
    onChange: handleDateRangeChange,
    minDate: getMinMaxDate(props.min),
    maxDate: getMinMaxDate(props.max),
    open: open,
    onOpen: handleOpen,
    onClose: handleClose,
    label: props.label || "Seleccionar rango de fechas",
    slotProps: {
      textField: {
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <FlightLandIcon />
            </InputAdornment>
          ),
        },
      },
    },
    sx: { width: '100%' }
  };

  return (
    <div>
      <Grid key={'key-' + props.id} item xs={12} sm={12} lg={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          {/* Renderizar solo UN picker basado en el tamaño de pantalla */}
          {isMobile ? (
            <MobileDateRangePicker {...commonProps} />
          ) : (
            <DesktopDateRangePicker {...commonProps} />
          )}
        </LocalizationProvider>

        {/* Inputs ocultos para formularios */}
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
      </Grid>
    </div>
  );
};

export const DateRangePickerMUI = qwikify$(MyDateRangePicker, {
  eagerness: "visible",
});