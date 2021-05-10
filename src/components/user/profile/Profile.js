import PropTypes from 'prop-types';
// material
import { Grid } from '@material-ui/core';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';

// ----------------------------------------------------------------------

Profile.propTypes = {
  myProfile: PropTypes.object
};

export default function Profile({ myProfile }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <ProfileFollowInfo profile={myProfile} />
        <ProfileAbout profile={myProfile} />
        <ProfileSocialInfo profile={myProfile} />
      </Grid>

      <Grid item xs={12} md={8}>
        <ProfilePostInput />
      </Grid>
    </Grid>
  );
}
