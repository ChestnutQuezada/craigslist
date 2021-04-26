const API_URL = 'https://strangers-things.herokuapp.com/api/2102-CPU-RM-WEB-PT';

const state = {
  token: '',
  responseObj: {},
  posts: [],
  messages: [],
  user: ''
};

const headers = () => {
  if (getToken()) {
  return {'Content-Type': 'Application/JSON',
  'Authorization': `Bearer ${getToken()}`}
  } else {
  return {'Content-Type': 'Application/JSON'}
  }
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const logIn = async (username, password) => {
  try {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
    user: {
      username,
      password
    }
    })
    })
    const responseObj = await response.json(); 
    if (responseObj.data) {
    setToken(responseObj.data.token);
    } 
    state.responseObj = responseObj; 
  } catch (error) {
    console.error(error)
  }
};  

const signUp = async (username, password) => {
  try {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: headers() ,
    body: JSON.stringify({
      user: {
        username,
        password
        }
      })
    })
    const responseObj = await response.json();

    if (responseObj.data.token) {
    setToken(responseObj.data.token); 
  }  
    state.responseObj = responseObj; 
  } catch (error){
    console.error(error);
  }
};

async function fetchAllPosts() {
  try {
        const data = await fetch(`${ API_URL }/posts`,{
          method: "GET",
          headers: headers()
        })
        const responseObj = await data.json();
    state.posts = responseObj.data.posts;
  } catch (error) {
    console.error(error);
  }
};

async function fetchUserData () {
  try {
  const response = await fetch(`${API_URL}/users/me`, {
  headers: headers(),
  });
  const responseObj = await response.json();
  if (responseObj.data !== null) {
    state.messages = responseObj.data.messages;
    state.username = responseObj.data.username;
  }
  } catch (error) {
    console.error(error)
  }
};

const createPost = async post => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({post}),
    });
    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error(error)
  }
};

const createMessage = async (postID , content) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postID}/messages`, {
    method: 'POST',
    headers: headers() ,
  body: JSON.stringify({message: {content}})
});
    const responseObj = await response.json();
  } catch(error) {
    console.error(error)
  }
};

const deletePost = async postID => {
  try {
    const response = await fetch(`${API_URL}/posts/${postID}`, {
  method: 'DELETE',
  headers: headers() 
  });
  const responseObj = await response.json();
  return responseObj;
  }
  catch(error) {
    console.error(error)
  } 
};

const editPost = async (postId, post) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PATCH',
      headers: headers() ,
      body: JSON.stringify({post}),
    });
    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error(error)
  }  
};

const navBar = () => {
  if (getToken()) {
      const navBarElem = $(`
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand">Stranger's Things</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
      <a class="nav-link" href="#" id="homeLink">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#" id="createButton" data-toggle="modal" data-target="#createPostModal">Create Post <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#" id="messageLink">Messages<span class="badge bg-primary rounded-pill" id="badge">${state.messages.length}</span></a>
      </li>        
      <form class="form-inline my-2 my-lg-0" id="search">
      <input class="form-control mr-sm-2" type="search" id="searchInput" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit" id="search-form">Search</button>
      </form>
      </ul>
      <div class="justify-content-end">
      <span id="username">Welcome, ${state.username}</span>
      <button class="btn btn-secondary my-2 my-sm-0" id="logOutButton" type="submit">Log Out</button>
      </div>
      </div>
      </nav>
      `);
return navBarElem;
  } else {
    const navBarElem = $(`
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand">Stranger's Things</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
  </button>
  
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav mr-auto">    
  <form class="form-inline my-2 my-lg-0" id="search">
  <input class="form-control mr-sm-2" type="search" id="searchInput" placeholder="Search" aria-label="Search">
  <button class="btn btn-light my-2 my-sm-0" type="submit" id="search-form">Search</button>
  </form>
  </ul>
  <div class="justify-content-end">
  <button class="btn btn-light my-2 my-sm-0" type="submit" id="signUpButton">Sign Up</button>
  <button class="btn btn-light my-2 my-sm-0" type="submit" id="logInButton">Sign In</button> 
  </div>
  </div>
  </nav>
  `);
  return navBarElem;
  }
};

const logInUser = () => {
  const logInElem = $(`
  <div class="form-logIn">
  <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
  <label for="inputUsername" class="sr-only">Username</label>
  <input type="username" id="inputUsernamelogIn" class="form-control" placeholder="Username" required>
  <label for="inputPassword" class="sr-only">Password</label>
  <input type="password" id="inputPasswordlogIn" class="form-control" placeholder="Password" required>
  <button class="btn btn-lg btn-primary btn-block" type="click" id="logInValidationButton">Sign in</button>
  <p class="mt-5 mb-3 text-muted">&copy; 2017-2020</p>
  </div>
  `)
return logInElem;
};

const signUpUser = () => {
  const signUpElem = $(`
  <div class="form-signup">
  <img class="mb-4" src="../assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
  <h1 class="h3 mb-3 font-weight-normal">Please sign up</h1>
  <label for="inputEmail" class="sr-only">Username</label>
  <input type="username" id="inputUsernameSignUp" class="form-control" placeholder="Username" required autofocus>
  <label for="inputPassword" class="sr-only">Password</label>
  <input type="password" id="inputPasswordSignUp" class="form-control" placeholder="Password" required>
  <button class="btn btn-lg btn-primary btn-block" type="click" id="signUpValidationButton">Sign Up</button>
  <p class="mt-5 mb-3 text-muted">&copy; 2017-2020</p>
  </div>
  `)
return signUpElem;
};

const createElementFromPost = (post) => {
  const {author:{username}, title, description, price, location, willDeliver, isAuthor, _id} = post;
  if (getToken()) {
  const messages = getMessagesFromPostId(_id);
  const cardElement = $(`
  <div class="col-sm">
  <div class="post" style="width: 18rem;">
  <div class="card-body">
  <h2 class="card-title">${title}</h2>
  <p class="card-text">${description}</p>
  <p class="card-text">By: ${username}</p>
  <p class="card-text">Price: ${price}</p>
  <p class="card-text">Location: ${location}</p>
  <p class="card-text">Will Deliver: ${willDeliver}</p>
  ${!isAuthor && getToken() !== undefined ? `<div class="messagefield">
  <a href="#" class="btn btn-primary" id="submitMessageButton">Contact ${username}</a></form></div>`: " "}
  ${isAuthor ? `
  <div id="button_delete_edit">
  <a href="#" class="btn btn-danger" id="deleteButtonAllPosts">Delete</a>
  <a href="#" class="btn btn-secondary" data-toogle="modal" data-target="#editPostModal" id="editButtonAllPosts">Edit</a>
  </div>
  <div id="messages" class="card" style="width: 16rem">
  <div class="card-header">Messages Received</div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item"> ${messages}</li>
    </ul>
  </div>`: " "}
  </div>
  </div>
  </div>
  `).data('card', post)
  return cardElement;
  }
  else if (getToken() === null) {
  const cardElement = $(`
  <div class="col-sm">
  <div class="post" style="width: 18rem;">
  <div class="card-body-loggedOut">
  <h2 class="card-title">${title}</h2>
  <p class="card-text">${description}</p>
  <p class="card-text">By: ${username}</p>
  <p class="card-text">Price: ${price}</p>
  <p class="card-text">Location: ${location}</p>
  <p class="card-text">Will Deliver: ${willDeliver}</p>
  </div>
  </div>
  </div>
  `).data('card', post);
  return cardElement;  
  }
};

const createElementFromMessageReceived = (card) => {
  const {fromUser:{username}, post: {title}, content} = card;
  const usernameState = state.username;
  const elementFromMessageReceived = $(`
  ${username !== usernameState ?
  `
  
  <table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">From</th>
      <th scope="col">Post</th>
      <th scope="col">Message</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">${username}</th>
      <td>${title}</td>
      <td>${content}</td>
    </tr>
  </tbody>
</table>
  
  ` :
  ""
  }
  `).data('card', card);
return elementFromMessageReceived;
};

const createNewPost = (myPost) => {
  const elementNewPost = $(`
<div class="modal" id="createPostModal" aria-hidden="true">  
<form class="newPostForm">  
<div class="card" style="width: 35rem;">
<div class="card-body-createPost">
<h3 id="titleAlert">Create New Post</h5>
<div class="mb-3">
<label for="createTitle">Title</label>
<input type="text" class="form-control" placeholder="required" id="createTitle" required>
</div>
<div class="mb-3">
<label for="createDescription">Description</label>
<textarea type="text" class="form-control" placeholder="required" id="createDescription" required></textarea>
</div>
<div class="mb-3">
<label for="createPrice">Price</label>
<input type="text" class="form-control" placeholder="required" id="createPrice" required>
</div>
<div class="mb-3">
<label for="createLocation">Location</label>
<input type="text" class="form-control" placeholder="optional" id="createLocation">
</div>
<div class="mb-3">
<label for="createWillDeliver">Will Deliver</label>
<input type="checkbox" class="form-control" id="createWillDeliver">
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-lg btn-secondary" data-dismiss="modal">Close</button> 
  <button type="button" class="btn btn-lg btn-primary" id="createPostSubmitButton" disabled>Submit</button>
 </div>
</div>
</div>
</form>
</div>`)
return elementNewPost;
};

const deletedPostModal = () => {
  deletedPost = $(`
<div class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`)
return deletedPost;
}; 

const updatePostModal = (myPost) => {
  const editPostElement = $(`
  <div class="modal" id="editPostModal" aria-hidden="true">  
  <form class="editPostForm">  
  <div class="card" style="width: 35rem;">
  <div class="card-body-createPost">
  <h3 id="titleAlert">Edit Post</h5>
  <div class="mb-3">
  <label for="createTitle">Title</label>
  <input type="text" class="form-control" placeholder="required" id="createTitle" required>
  </div>
  
  <div class="mb-3">
  <label for="createDescription">Description</label>
  <textarea type="text" class="form-control" placeholder="required" id="createDescription" required></textarea>
  </div>
  
  <div class="mb-3">
  <label for="createPrice">Price</label>
  <input type="text" class="form-control" placeholder="required" id="createPrice" required>
  </div>
  
  <div class="mb-3">
  <label for="createLocation">Location</label>
  <input type="text" class="form-control" placeholder="optional" id="createLocation">
  </div>
  
  <div class="mb-3">
  <label for="createWillDeliver">Will Deliver</label>
  <input type="checkbox" class="form-control" id="createWillDeliver">
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-lg btn-secondary" data-dismiss="modal" id="editPostCloseButton">Close</button> 
    <button type="button" class="btn btn-lg btn-primary" id="editPostSubmitButton">Submit</button>
  </div>
  <input hidden type="text" id="hiddenId"></input>
  </div>
  </div>
  </form>
  </div>`)
return editPostElement;
}; 

const contactSeller = (myMessage) => {
  const contactSellerElem = $(`
  <div class="modal" id="editPostModal" aria-hidden="true">  
    <form class="editPostForm">  
      <div class="card" style="width: 35rem;">
        <div class="card-body-createPost">
          <h3 id="titleAlert">Contact Seller</h3>
          <div class="input-group">
          <textarea class="form-control" aria-label="With textarea" placeholder="Type Message Here"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-lg btn-secondary" data-dismiss="modal" id="contactSellerCloseButton">Close</button> 
            <button type="button" class="btn btn-lg btn-primary" id="contactSellerSubmitButton">Submit</button>
          </div>
          <input hidden type="text" id="hiddenIdContactSeller"></input>
        </div>
      </div>
    </form>
  </div>`)
return contactSellerElem;
}; 

$('#message').on('click','#logInButton', function triggerlogInForm(){
$('#messageContainer').empty();
$('#messageContainer').append(logInUser());
});

$('#messageContainer').on('click','#logInValidationButton', async function logInValidation(){
  const usernamelogIn = $('#inputUsernamelogIn');
  const passwordlogIn = $('#inputPasswordlogIn');
  const obj = {
    user: $('#messageContainer').find(usernamelogIn).val(),
    password: $('#messageContainer').find(passwordlogIn).val()
  }
  try {
  await logIn(obj.user, obj.password)
  if ( state.responseObj.success ) {
    swal(`"You are logged in" ${state.username}`);
    $('#messageContainer').empty();
    await fetchAllPosts(); 
    await fetchUserData();
    $('#messageContainer').empty();
    renderPosts();
    render();
  } else {
    swal("Wrong Username/Password, try again!")
  }
  } catch (error) {
    console.error(error)
  }
});

$('#message').on('click','#signUpButton', function triggerSignUpForm(){
  $('#messageContainer').empty();
$('#messageContainer').append(signUpUser());
});

$('#messageContainer').on('click','#signUpValidationButton', async function signUpValidation(){
  const obj = {
    user: $('#messageContainer').find('#inputUsernameSignUp').val(),
    password: $('#messageContainer').find('#inputPasswordSignUp').val()
  }
  await signUp(obj.user, obj.password);
  if ( state.responseObj.success ) {
    swal("Congrats on signing up!" )
    $('#messageContainer').empty();
    await fetchAllPosts(); 
    await fetchUserData();
    $('#messageContainer').empty();
    renderPosts();
    render();
  } else {
    swal("Error: Please provide a username/password")
  }
});

 $('#message').on('click','#logOutButton', function logOutButton(){
  logOut();
});

 const logOut = () => {
  $('#messageContainer').empty(); 
  localStorage.clear();   
  render();
  renderPosts();
};

 $('#message').on('click','#messageLink', function messagesAccess(){
  const messageReceived = renderMessageReceived(state.messages);
  $('#messageContainer').append(messageReceived)
});

$('#message').on('click','#homeLink', function homeAccess(){
  $('#messageContainer').empty(); 
  render();
  renderPosts();
});

$('#message').on('click', '#createButton', function (event) {
  $('#message').append(createNewPost());
});

$('#message').on('input', '#createTitle, #createDescription, #createPrice', function(){
  if($('#createTitle').val() != '' && $('#createDescription').val()!='' && $('#createPrice').val()!='') {
    $('#createPostSubmitButton').removeAttr("disabled");
  } 
});

$('#message').on('click', '#createPostSubmitButton', async function (event){
  event.preventDefault();
  $('#createPostModal').modal('hide');
  const postObj = {
    title: $('#createTitle').val(),
    description: $('#createDescription').val(),
    price: $('#createPrice').val(),
    location: $('#createLocation').val(),
    willDeliver: $('#createWillDeliver').attr('checked')
  } 
  try {
    const {data: {post}} = await createPost(postObj);
    state.posts.push(post)
    const createdPost = {data: {post}}
    swal("Post has been created!");
    state.posts.map((post) => {
      newPost = createdPost.data.post;
    })
    const cardElem = createElementFromPost(newPost)
    $("#messageContainer").prepend(cardElem);
    render();
  } catch (error) {
    console.error(error)
  }
});

const getMessagesFromPostId = (postId) => {
  let result = "";
  state.messages.forEach(function(message) {
    if (message.post._id === postId) {
      result= "<div>"+message.fromUser.username+": "+message.content+"</div>"
    }
  })
  return result;
}; 

$('#messageContainer').on('click', '#submitMessageButton', async function (event){
  const modal = contactSeller();
  $('#message').append(modal);
  modal.show();
  const modalBackdrop = $('<div class="modal-backdrop"></div>');
  $('body').append(modalBackdrop);
  const postElem = $(this).closest('.col-sm');
  const card = postElem.data('card');
  const postId = card._id;
  const hiddenIdContactSeller = {
  hiddenIdContactSeller: $('#hiddenIdContactSeller').val(postId)  
  }
});

$('#message').on('click', '#contactSellerCloseButton', function (event) {
  $('.card-body-createPost').hide();
  $('.modal-backdrop').remove();
  render();
})

$('#message').on('click', '#contactSellerSubmitButton', async function (event){
  event.preventDefault();
  $('.card-body-createPost').hide();
  $('.modal-backdrop').remove();
  $('#messageContainer').empty();
  const postElem = $(this).closest('.card-body-createPost');
  const postId = $('#hiddenIdContactSeller').val()
  const messageContent = postElem.find('.form-control').val();
  swal("Your message has been sent!");
  await createMessage(postId, messageContent);
  renderPosts();
  render();
}); 


$('#messageContainer').on('click', '#deleteButtonAllPosts', async function (){
  const postElem = $(this).closest('.col-sm');
  const deletedPost = postElem.data('card');
  try {
    const result = await deletePost(deletedPost._id); 
    postElem.hide();
    swal("Your post has been deleted!");
    state.posts.pop(result)
    state.posts.map((post) => {
      newPost = result.post;
    })
      } catch(error){
      console.error(error);
    }
});

$('#messageContainer').on('click', '#editButtonAllPosts', function (event) {
  const modal = updatePostModal();
  $('#message').append(modal);
  modal.show();
  const modalBackdrop = $('<div class="modal-backdrop"></div>');
  $('body').append(modalBackdrop)
  const postElem = $(this).closest('.col-sm');
  const card = postElem.data('card');
  const postId = card._id;
  const hiddenId = {
  hiddenId: $('#hiddenId').val(postId)  
  }
  const postData = {
  title: $('#createTitle').val(card.title),
  description: $('#createDescription').val(card.description),
  price: $('#createPrice').val(card.price),
  location: $('#createLocation').val(card.location),
  willDeliver: $('#createWillDeliver').val(card.willDeliver)
  }
});

$('#message').on('click', '#editPostCloseButton', function (event) {
  $('.card-body-createPost').hide();
  $('.modal-backdrop').remove();
  render();
})

$('#message').on('click', '#editPostSubmitButton', async function (event) {
  event.preventDefault();
  $('.card-body-createPost').hide();
  $('.modal-backdrop').remove();
  const postData = {
    title: $('#createTitle').val(),
    description: $('#createDescription').val(),
    price: $('#createPrice').val(),
    location: $('#createLocation').val(),
    willDeliver: $('#createWillDeliver').val()
  }
  const postId = $('#hiddenId').val()

  if (postData) {
    try {
      const result = await editPost(postId, postData);
      location.reload(true);
    } catch(error) {
      console.error(error)
    }
  }
}); 

$('#message').on('click', '#search-form', function(event) {
  $('#messageContainer').empty();
  event.preventDefault();
  const searchVal = $('#searchInput').val();
  const searchPost = state.posts.filter(function(post){
  return post.title.toLowerCase().includes(searchVal.toLowerCase()) ||
  post.description.toLowerCase().includes(searchVal.toLowerCase()) ||
  post.price.toLowerCase().includes(searchVal.toLowerCase()) ||
  post.author.username.toLowerCase().includes(searchVal.toLowerCase())
  });
  $('#messageContainer').append(renderSearchPosts(searchPost));
  const resetButton = $(`
  <div class="messageContainer">
  <input class="btn btn-primary" id="resetButton" type="reset" value="Reset All Posts">
  </div>
  `)
  render();
  $('#message').append(resetButton);
});

$('#message').on('click', '#resetButton', function(){
  "button clicked"
  $('#messageContainer').empty();
  render();
  renderPosts();
});

const renderMessageReceived = async (messageCard) => {
  $('#messageContainer').empty();
  $('#messageContainer').append('<div id="messageReceivedDiv"><h1>Messages Received</h1></div>');
  try {
  messageCard.forEach(function(message){
  const messageCardElem = createElementFromMessageReceived(message)
  $("#messageContainer").append(messageCardElem); 
  }) 
  } catch(error) {
    console.error(error)
  }
};

const render = (posts) => {
  const message = $('#message');
  message.empty();
  message.append(navBar());
};

const renderPosts = () => {
  state.posts.forEach(function(post){
  const cardElem = createElementFromPost(post)
  $("#messageContainer").prepend(cardElem);
  })
};

const renderSearchPosts = (posts) => {
  posts.forEach(function(post){
    const cardElem = createElementFromPost(post)
    $("#messageContainer").prepend(cardElem);
  })
};

const bootstrap = async () => {
  try {
  getToken();
  await fetchUserData();
  await fetchAllPosts();
  render();
  renderPosts();
  } catch (error) {
    console.error(error);
  }
};

bootstrap();