import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles, useTheme, experimentalStyled as styled, alpha } from '@material-ui/core/styles';
// components
import { Autocomplete, Box, ClickAwayListener, InputAdornment, InputBase, Popper, TextField } from '@material-ui/core';
import { autocompleteClasses } from '@material-ui/core/Autocomplete';
// icons
import FilterAltOutlinedIcon from '@material-ui/icons/FilterAltOutlined';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

const StyledTextField = withStyles((theme) => ({
  root: {
    border: 'none',
    fontSize: '0.800rem',
    width: '98%',
    outline: 'none',
    padding: 0,
    marggin: 0,
    '& .MuiInputBase-root': {
      height: '2em',
      padding: 0,
      paddingLeft: 5,
      fontSize: '0.800rem',
      borderRadius: 0
    },
    '& .MuiOutlinedInput-root': {
      marginBottom: 5,
      '& fieldset': {
        borderColor: `${theme.palette.divider}`
      }
    }
  }
}))(TextField);

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: 'none',
    margin: 0,
    color: 'inherit',
    fontSize: 13
  },
  [`& .${autocompleteClasses.listbox}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: 'auto',
      alignItems: 'flex-start',
      padding: 8,
      borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'}`,
      '&[aria-selected="true"]': {
        backgroundColor: 'transparent'
      },
      '&[data-focus="true"], &[data-focus="true"][aria-selected="true"]': {
        backgroundColor: theme.palette.action.hover
      }
    }
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: 'relative'
  }
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: 10,
  width: '100%',
  borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
  '& input': {
    borderRadius: 4,
    padding: 8,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
    fontSize: '0.840rem',
    '&:focus': {
      border: `2px solid ${theme.palette.primary.main}`
    }
  }
}));

const StyledPopper = styled(Popper)(({ theme }) => ({
  paddingTop: 0,
  marginTop: 0,
  border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
  boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'}`,
  borderRadius: 6,
  minWidth: 300,
  zIndex: theme.zIndex.modal,
  fontSize: '0.800rem',
  color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128'
}));

// Define a default UI for filtering
export function DefaultColumnFilter({ column, setColumnaSeleccionada, combos }) {
  return (
    <>
      {(column.componente === 'Texto' ||
        column.componente === 'TextoNumero' ||
        column.componente === 'TextoEntero') && (
        <FiltroTexto column={column} setColumnaSeleccionada={setColumnaSeleccionada} />
      )}

      {column.componente === 'Combo' && (
        <FiltroCombo column={column} setColumnaSeleccionada={setColumnaSeleccionada} combos={combos} />
      )}
    </>
  );
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired,
  combos: PropTypes.array
};

const FiltroTexto = ({ column, setColumnaSeleccionada }) => {
  const theme = useTheme();

  const onChange = (e) => {
    setColumnaSeleccionada(undefined);
    column.setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
  };

  const onClear = () => {
    setColumnaSeleccionada(undefined);
    column.setFilter(undefined);
  };

  return (
    <StyledTextField
      variant="outlined"
      margin="none"
      size="small"
      value={column.filterValue || ''}
      onChange={onChange}
      InputProps={{
        startAdornment: column.filterValue ? (
          <InputAdornment position="start" onClick={onClear}>
            <ClearIcon
              fontSize="small"
              sx={{ backgroundColor: alpha(theme.palette.primary.lighter, 0.9), borderRadius: 50, cursor: 'pointer' }}
            />
          </InputAdornment>
        ) : (
          <InputAdornment position="start">
            <FilterAltOutlinedIcon fontSize="small" color="disabled" />
          </InputAdornment>
        )
      }}
    />
  );
};
FiltroTexto.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired
};

const FiltroCombo = ({ column, setColumnaSeleccionada, combos }) => {
  const [listaCombo, setListaCombo] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState([]);
  const [pendingValue, setPendingValue] = useState([]);

  useEffect(() => {
    const combo = combos.find((col) => col.columna === column.nombre);
    if (combo) {
      setListaCombo(combo.listaCombo || []);
    }
  }, [combos]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = useTheme();

  const handleClose = () => {
    setValue(pendingValue);
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSelect = () => {
    setValue(pendingValue);
    column.filterValue = pendingValue;
    setColumnaSeleccionada(undefined);
    column.setFilter(pendingValue || undefined);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const onClear = () => {
    column.filterValue = undefined;
    setValue([]);
    setPendingValue([]);
    setColumnaSeleccionada(undefined);
    column.setFilter(undefined);
    setAnchorEl(null);
    setOpen(false);
  };

  const id = open ? 'github-label' : undefined;

  return (
    <>
      <StyledTextField
        variant="outlined"
        margin="none"
        size="small"
        readOnly
        value={value.map((element) => element.label).join(', ')}
        onFocus={handleClick}
        InputProps={{
          startAdornment:
            value.length > 0 ? (
              <InputAdornment position="start">
                <ClearIcon
                  fontSize="small"
                  onClick={onClear}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.lighter, 0.9),
                    borderRadius: 50,
                    cursor: 'pointer'
                  }}
                />
              </InputAdornment>
            ) : (
              <InputAdornment position="start">
                <FilterAltOutlinedIcon fontSize="small" color="disabled" />
              </InputAdornment>
            )
        }}
      />

      <StyledPopper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" style={{ width: column.width }}>
        <ClickAwayListener onClickAway={handleSelect}>
          <Autocomplete
            multiple
            open
            disableCloseOnSelect
            value={pendingValue}
            onClose={handleClose}
            onChange={(event, newValue, reason) => {
              if (event.type === 'keydown' && event.key === 'Backspace' && reason === 'removeOption') {
                return;
              }
              setPendingValue(newValue);
            }}
            options={[...listaCombo].sort((a, b) => {
              // Display the selected labels first.
              let ai = value.indexOf(a);
              ai = ai === -1 ? value.length + listaCombo.indexOf(a) : ai;
              let bi = value.indexOf(b);
              bi = bi === -1 ? value.length + listaCombo.indexOf(b) : bi;
              return ai - bi;
            })}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Box
                  component={DoneIcon}
                  sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                  style={{
                    visibility: selected ? 'visible' : 'hidden'
                  }}
                />
                <Box
                  sx={{
                    flexGrow: 1,
                    '& span': {
                      color: theme.palette.mode === 'light' ? '#586069' : '#8b949e'
                    }
                  }}
                >
                  {option.label}
                </Box>
                <Box
                  component={CloseIcon}
                  sx={{ opacity: 0.6, width: 18, height: 18 }}
                  style={{
                    visibility: selected ? 'visible' : 'hidden'
                  }}
                />
              </li>
            )}
            PopperComponent={PopperComponent}
            renderTags={() => null}
            noOptionsText=""
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <StyledInput
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                placeholder="Buscar..."
              />
            )}
          />
        </ClickAwayListener>
      </StyledPopper>
    </>
  );
};
FiltroCombo.propTypes = {
  column: PropTypes.object.isRequired,
  setColumnaSeleccionada: PropTypes.func.isRequired,
  combos: PropTypes.array
};

function PopperComponent(props) {
  const { disablePortal, anchorEl, open, ...other } = props; // eslint-disable-line
  return <StyledAutocompletePopper {...other} />;
}

PopperComponent.propTypes = {
  anchorEl: PropTypes.any,
  disablePortal: PropTypes.bool,
  open: PropTypes.bool.isRequired
};
