import { map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  posts: [],
  users: [],
  userList: [],
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PROFILE
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // GET FOLLOWERS
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // ON TOGGLE FOLLOW
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },

    // GET FRIENDS
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.friends = action.payload;
    },

    // GET GALLERY
    getGallerySuccess(state, action) {
      state.isLoading = false;
      state.gallery = action.payload;
    },

    // GET MANAGE USERS
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },

    // GET CARDS
    getCardsSuccess(state, action) {
      state.isLoading = false;
      state.cards = action.payload;
    },

    // GET ADDRESS BOOK
    getAddressBookSuccess(state, action) {
      state.isLoading = false;
      state.addressBook = action.payload;
    },

    // GET INVOICES
    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },

    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const profile = {
        id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-1`,
        cover: '/static/mock-images/covers/cover_1.jpg',
        position: 'UI Designer',
        follower: 1234,
        following: 45678,
        quote:
          'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
        country: 'Ecuador',
        email: 'diego10j.89@hotmail.com',
        company: 'ProduApps',
        school: 'Universidad',
        facebookLink: `https://www.facebook.com/caitlyn.kerluke`,
        instagramLink: `https://www.instagram.com/caitlyn.kerluke`,
        linkedinLink: `https://www.linkedin.com/in/caitlyn.kerluke`,
        twitterLink: `https://www.twitter.com/caitlyn.kerluke`
      };
      dispatch(slice.actions.getProfileSuccess(profile));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPosts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const posts = [...Array(3)].map((_, index) => {
        const setIndex = index + 1;
        return {
          id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${index + 1}`,
          author: {
            id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba8-${index + 2}`,
            avatarUrl: `/static/mock-images/avatars/avatar_1.jpg`,
            name: 'Caitlyn Kerluke'
          },
          isLiked: true,
          createdAt: new Date(),
          media: `/static/mock-images/feeds/feed_${index}.jpg`,
          message: 'msg',
          personLikes: [...Array(50)].map((_, index) => ({
            name: 'name',
            avatarUrl: `/static/mock-images/avatars/avatar_${index + 2}.jpg`
          })),
          comments: (setIndex === 2 && []) || [
            {
              id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${index + 6}`,
              author: {
                id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${index + 3}`,
                avatarUrl: `/static/mock-images/avatars/avatar_${index}.jpg`,
                name: 'name'
              },
              createdAt: new Date(),
              message: 'msg'
            }
          ]
        };
      });

      dispatch(slice.actions.getPostsSuccess(posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFollowers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const followers = [...Array(18)].map((_, index) => {
        const setIndex = index + 2;
        return {
          id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${index + 1}`,
          avatarUrl: `/static/mock-images/covers/cover_${setIndex}.jpg`,
          name: 'name',
          country: 'country',
          isFollowed: true
        };
      });
      dispatch(slice.actions.getFollowersSuccess(followers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFriends() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const friends = [...Array(18)].map((_, index) => {
        const setIndex = index + 2;
        return {
          id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${setIndex + 2}`,
          avatarUrl: `/static/mock-images/avatars/avatar_${setIndex}.jpg`,
          name: 'name',
          role: null
        };
      });
      dispatch(slice.actions.getFriendsSuccess(friends));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getGallery() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const gallery = [...Array(18)].map((_, index) => {
        const setIndex = index + 2;
        return {
          id: `fc68bad5-d430-4033-b8f8-4bc069dc0ba0-${setIndex + 1}`,
          title: 'title',
          postAt: new Date(),
          imageUrl: `/static/mock-images/covers/cover_${setIndex}.jpg`
        };
      });

      dispatch(slice.actions.getGallerySuccess(gallery));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUserList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/user/manage-users');
      dispatch(slice.actions.getUserListSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getCards() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/user/account/cards');
      dispatch(slice.actions.getCardsSuccess(response.data.cards));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAddressBook() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/user/account/address-book');
      dispatch(slice.actions.getAddressBookSuccess(response.data.addressBook));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getInvoices() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/user/account/invoices');
      dispatch(slice.actions.getInvoicesSuccess(response.data.invoices));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNotifications() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        '/api/user/account/notifications-settings'
      );
      dispatch(
        slice.actions.getNotificationsSuccess(response.data.notifications)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/user/all');
      dispatch(slice.actions.getUsersSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
