import PropTypes from 'prop-types';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Typography, Card, CardContent } from '@material-ui/core';
import { SeoIllustration } from '../../../assets';
import { getFormatoMoment } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  [theme.breakpoints.up('xl')]: { height: 320 }
}));

// ----------------------------------------------------------------------

AppWelcome.propTypes = {
  displayName: PropTypes.string
};

export default function AppWelcome({ displayName }) {
  const fechaUltimoAcceso = `Último ingreso ${getFormatoMoment(
    localStorage.getItem('ultimaFecha'),
    'll',
    'DD-MM-YYYY'
  )}  /  ${getFormatoMoment(localStorage.getItem('ultimaFecha'), 'LT', 'DD-MM-YYYY h:mm:ss')}`;

  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800'
        }}
      >
        <Typography gutterBottom variant="h4">
          Bienvenid@,
          <br /> {!displayName ? '...' : displayName}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          {fechaUltimoAcceso}
        </Typography>
      </CardContent>

      <SeoIllustration
        sx={{
          p: 2,
          height: 280,
          margin: { xs: 'auto', md: 'inherit' }
        }}
      />
    </RootStyle>
  );
}
