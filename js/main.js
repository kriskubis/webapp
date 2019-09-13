"use strict";

///////////// THIS IS THE SPA FUNCTION //////////////////////////////////
function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}

// show page or tab
function showPage(pageId) {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  location.href = `#${pageId}`;
  setActiveTab(pageId);
}

// sets active tabbar/ menu item
function setActiveTab(pageId) {
  let pages = document.querySelectorAll(".tabbar a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }

  }
}

// set default page
function setDefaultPage() {
  var page = "loginPage";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}

setDefaultPage();
// function showLoader(show) {
//   let loader = document.querySelector('#loader');
//   if (show) {
//     loader.classList.remove("hide");
//   } else {
//     loader.classList.add("hide");
//   }
// }

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrByQhB5S3AjMN2R8YfyKyoqO4SIC32ik",
  authDomain: "piggybankwebapp.firebaseapp.com",
  databaseURL: "https://piggybankwebapp.firebaseio.com",
  projectId: "piggybankwebapp",
  storageBucket: "piggybankwebapp.appspot.com",
  messagingSenderId: "128978077012",
  appId: "1:128978077012:web:b0df47522c64bc593f74c1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const billRef = db.collection("bills");
const postRef = db.collection("posts");
const userRef = db.collection("users");


// Firebase UI configuration
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: '#expensesPage',
};


const ui = new firebaseui.auth.AuthUI(firebase.auth());



// Listen on authentication state change
firebase.auth().onAuthStateChanged(function(user) {
  let tabbar = document.querySelector('#tabbar-footer');
  console.log(user);
  if (user) { // if user exists and is authenticated
    setDefaultPage();
    tabbar.classList.remove("hide");
  } else { // if user is not logged in
    showPage("loginPage");
    tabbar.classList.add("hide");
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});


// sign out user
function logout() {
  firebase.auth().signOut();
}

// ========== CREATE BILLS ==========
// watch the database ref for changes

billRef.orderBy("time","desc").onSnapshot(function(snapshotData) {
  let bills = snapshotData.docs;
  appendBill(bills);
});



// append posts to the DOM
function appendBill(bills) {
  let htmlTemplate = "";
  for (let bill of bills) {
    console.log(bill.id);
    htmlTemplate += `
    <article class="row entry">
        <div class="col-2">
          <div class="billImage">
          </div>
        </div>
        <div class="col-6 text-left">
          <h4>${bill.data().title}</h4>
          <span class="tag ${bill.data().post}">${bill.data().post}</span>
        </div>
        <div class="col-4">
          <h5>${bill.data().amount} ${bill.data().currency}</h5>
        </div>
    </article>
    `;
  }
  document.querySelector('#bills').innerHTML = htmlTemplate;
}


// ========== CREATE  BILLS==========
// add a new user to firestore (database)
function addBill() {
  // references to the input fields
  let billTitleInput = document.querySelector('#billTitle').value;
  let billPostInput = document.querySelector('#chosenPost').value;
  let billAmountInput = document.querySelector('#billAmount').value;
  let billCurrencyInput = document.querySelector('#chosenCurrency').value;
  let timestamp = firebase.firestore.FieldValue.serverTimestamp();
  console.log(billTitleInput.value);

  db.collection("bills").add ({
    title: billTitleInput,
    amount: billAmountInput,
    post: billPostInput,
    currency: billCurrencyInput,
    time: timestamp,
  });
  var page = "expensesPage";
  showPage(page);
}


// ========== POSTS ==========
// watch the database ref for changes
postRef.onSnapshot(function(snapshotData) {
  let posts = snapshotData.docs;
  appendPost(posts);
});

// append posts to the DOM
function appendPost(posts) {
  let htmlTemplate = "";
  for (let post of posts) {
    console.log(post.data().title);
    htmlTemplate += `
    <article class="row entry ${post.data().expense}">
        <div class="col-8 text-left">
          <h4>${post.data().title}</h4>
        </div>
        <div class="col-2">
          <h5>${post.data().amount1}</h5>
        </div>
        <div class="col-2">
          <h5>${post.data().amount2}</h5>
        </div>
    </article>
    `;
  }
  document.querySelector('#posts').innerHTML = htmlTemplate;
}

// ========== CREATE POST ==========
// add a new user to firestore (database)
function addPost() {
  // references to the input fields
  let postTitleInput = document.querySelector('#postTitle').value;
  let postAmountInput1 = document.querySelector('#postAmount1').value;
  let postAmountInput2 = document.querySelector('#postAmount2').value;
  let postExpenseInput = document.querySelector('#postExpense').value;
  let chosenSheetInput = document.querySelector('#chosenSheet').value;
  //let postIncomeInput = document.querySelector('#postIncome');
  console.log(postTitleInput.value);

  let newPost = {
    title: postTitleInput,
    amount1: postAmountInput1,
    amount2: postAmountInput2,
    expense: postExpenseInput,
    sheet: chosenSheetInput,
    //find out about checkbox
    //postIncome: postIncomeInput.value,
  };

  postRef.add(newPost);
  var page = "budgetPage";
  showPage(page);
}


// ========== CREATE USER ==========
function createUser(){
  let createUsernameInput = document.querySelector('#createUsername').value;
  let createPasswordInput = document.querySelector('#createPassword').value;
  let createEmailInput = document.querySelector('#createEmail').value;
  console.log(createUsernameInput.value);
if (createPasswordInput.length >= 6){
firebase.auth().createUserWithEmailAndPassword(createEmailInput, createPasswordInput);
alert("succes");
}
else {alert("Password must contain at least 6 characters");}
}

// ========== LOG IN ==========
function logInUser(){
  let emailInput = document.querySelector('#email').value;
  let passwordInput = document.querySelector('#password').value;
  // Listen on authentication state change
  firebase.auth().onAuthStateChanged(function(user) {
    let tabbar = document.querySelector('#tabbar-footer');
    console.log(user);
    if (user) { // if user exists and is authenticated
        var page = "expensesPage";
        showPage(page);

      tabbar.classList.remove("hide");
    } else { // if user is not logged in
      alert("Incorrect username or password");
    }
  });
}




/*
// ========== UPDATE ==========

function selectBill(billTitle, billPost, billAmount, billCurrency ) {}

function updateBill() {}

// ========== DELETE ==========
function deleteBill(id) {}
*/
