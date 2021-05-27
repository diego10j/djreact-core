import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Stack, Link, Container, Typography, Button } from '@material-ui/core';
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
// layouts
import AuthLayout from '../../layouts/AuthLayout';
// components
import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';
import { LoginForm } from '../../components/authentication/login';
import AuthFirebaseSocials from '../../components/authentication/AuthFirebaseSocial';
import { FondoLogin, LoginIllustration } from '../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled('div')(() => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  margin: 0,
  overflow: 'hidden'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method, login } = useAuth();

  const handleLoginAuth0 = async () => {
    try {
      await login();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyle title="Login">
      <AuthLayout>
        ¿No tienes cuenta? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
          Registrarse
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <FondoLogin
            sx={{
              marginTop: '-40px',
              marginLeft: '-20px',
              marginBottom: '-10px'
            }}
          />
          <LoginIllustration
            className="animate__animated animate__zoomInLeft"
            sx={{
              width: '30%',
              maxWidth: '30%',
              position: 'absolute',
              top: '35%',
              animation: 'bounce'
            }}
          />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm" className="animate__animated animate__fadeIn">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Iniciar Sesión
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Ingresa tus datos a continuación.</Typography>
            </Box>

            <Box component="img" src="/static/auth/ic_react.png" sx={{ width: 32, height: 32 }} />
          </Stack>

          {method === 'firebase' && <AuthFirebaseSocials />}

          {method !== 'auth0' ? (
            <LoginForm />
          ) : (
            <Button fullWidth size="large" type="submit" variant="contained" onClick={handleLoginAuth0}>
              Login
            </Button>
          )}

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              ¿No tienes cuenta?&nbsp;
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Registrarse
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
