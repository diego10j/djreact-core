import React, { useState } from 'react';
import { isString } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDropzone } from 'react-dropzone';
import roundAddAPhoto from '@iconify/icons-ic/round-add-a-photo';
// material
import { alpha, experimentalStyled as styled } from '@mui/material/styles';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
// hooks
import useMensaje from '../../../hooks/useMensaje';
// utils
import { fData } from '../../../utils/formatNumber';
import { backendUrl } from '../../../config';
// servicios
import { subirFoto } from '../../../services/sistema/servicioUpload';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  borderRadius: '50%',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`
}));

const DropZoneStyle = styled('div')({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '50%',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': {
      zIndex: 9
    }
  }
});

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&:hover': { opacity: 0.72 }
}));

// ----------------------------------------------------------------------

UploadImagen.propTypes = {
  onUpload: PropTypes.func.isRequired,
  error: PropTypes.bool,
  autoUpload: PropTypes.bool,
  pesoMaximo: PropTypes.number,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  sx: PropTypes.object
};

export default function UploadImagen({ error, file, onUpload, pesoMaximo, autoUpload = true, sx, ...other }) {
  const maxSize = pesoMaximo || 3145728; // por defecto maximo peso del archivo 3.1MB

  const [cargando, setCargando] = useState(false);
  const { showMensajeError } = useMensaje();

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      handleDrop(acceptedFiles);
    },
    maxSize,
    ...other
  });

  const handleDrop = async (acceptedFiles) => {
    const tmpImage = acceptedFiles[0];
    if (tmpImage) {
      let nombreImagen = null;
      setCargando(true);
      if (autoUpload === true) {
        try {
          // sube la imagen al servidor
          nombreImagen = await subirFoto(tmpImage);
        } catch (err) {
          console.log(err);
          showMensajeError(err);
          setCargando(false);
          return;
        }
      }
      onUpload({
        ...tmpImage,
        nombreImagen,
        preview: URL.createObjectURL(tmpImage)
      });
      setCargando(false);
    }
  };

  const imagenUrl = `${backendUrl}/api/uploads/getImagen/`;

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        my: 2,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>
            {errors.map((e) => (
              <Typography key={e.code} variant="caption" component="p">
                - {e.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <>
      <RootStyle sx={sx}>
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter'
            })
          }}
        >
          <input {...getInputProps()} />

          {file && (
            <Box
              component="img"
              alt="Imagen"
              src={isString(file) ? `${imagenUrl}${file}` : file.preview}
              sx={{ zIndex: 8, objectFit: 'cover' }}
            />
          )}
          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: 'common.white',
                bgcolor: 'grey.900',
                '&:hover': { opacity: 0.72 }
              })
            }}
          >
            <Box component={Icon} icon={roundAddAPhoto} sx={{ width: 24, height: 24, mb: 1 }} />
            <Typography variant="caption">{file ? 'Actualizar Imágen' : 'Subir Imágen'}</Typography>
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {cargando === true && (
        <Box sx={{ width: '50%', mt: 2, mx: 'auto', display: 'block', textAlign: 'center' }}>
          <LinearProgress />
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          mt: 2,
          mx: 'auto',
          display: 'block',
          textAlign: 'center',
          color: 'text.secondary'
        }}
      >
        Permitidos *.jpeg, *.jpg, *.png, *.gif
        <br /> Tamaño máximo de {fData(maxSize)}
      </Typography>

      {fileRejections.length > 0 && <ShowRejectionItems />}
    </>
  );
}
