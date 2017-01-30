import * as firebase from 'firebase';

export const setStories = () => (dispatch, getState) => {
	let stories = firebase.database().ref('stories')
  const activeFrequency = getState().frequencies.active

  stories.orderByChild('frequency').equalTo(activeFrequency).on('value', function(snapshot){
    const snapval = snapshot.val();
    if (!snapval) return true;
    // test to see if this is a snapshot of the full list
    let key = Object.keys(snapshot.val())[0];
    if (snapshot.val()[key].creator){
      dispatch({
        type: 'SET_STORIES',
        stories: snapshot.val()
      })
    }
  });
}

export const upvote = (storyId) => (dispatch, getState) => {
  const uid = getState().user.uid
  const upvote = {};
  upvote[`stories/${storyId}/upvotes/${uid}`] = true;
  firebase.database().ref().update(upvote, function(error){
    console.log(error);
  })
}

export const createStory = (content) => (dispatch, getState) => {
	const user = getState().user
  const uid = user.uid
  const activeFrequency = getState().frequencies.active
	let newStoryRef = firebase.database().ref().child('stories').push();
  const key = newStoryRef.key
  let storyData = {
    id: key,
    creator: {
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid
    },
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    content: content,
    frequency: activeFrequency
  }
  newStoryRef.set(storyData, function(err){
  	console.log(err)
  });

  dispatch({
    type: 'SET_ACTIVE_STORY',
    key
  })
}

export const setActiveStory = (id) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_STORY',
    id
  })
}