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
  let page = "loginPage";
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

// ========== BILLS ==========
// watch the database ref for changes
billRef.onSnapshot(function(snapshotData) {
  let bills = snapshotData.docs;
  appendBills(bills);
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
          <h4>${bill.data().billTitle}</h4>
          <span class="tag">${bill.data().chosenPost}</span>
        </div>
        <div class="col-4">
          <h5>${bill.data().billAmount} ${bill.data().chosenCurrency}</h5>
        </div>
    </article>
    `;
  }
  document.querySelector('#bills').innerHTML = htmlTemplate;
}

// ========== CREATE ==========
// add a new user to firestore (database)
function addBill() {
  // references to the input fields
  let billTitleInput = document.querySelector('#billTitle');
  let billPostInput = document.querySelector('#billPost');
  let billAmountInput = document.querySelector('#billAmount');
  let billCurrencyInput = document.querySelector('#billCurrency');
  console.log(billTitleInput.value);

  let newBill = {
    billTitle: billTitleInput.value,
    billPost: billPostInput.value,
    billAmount: billAmountInput.value,
    billCurrency: billCurrencyInput.value,
  };

  billRef.add(newBill);
}

// ========== POSTS ==========
// watch the database ref for changes
postRef.onSnapshot(function(snapshotData) {
  let posts = snapshotData.docs;
  appendPosts(posts);
});

// append posts to the DOM
function appendPosts(posts) {
  let htmlTemplate = "";
  for (let post of posts) {
    console.log(post.id);
    htmlTemplate += `
    <article class="row entry">
        <div class="col-2">
          <div class="billImage">

          </div>
        </div>
        <div class="col-6 text-left">
          <h4>${post.data().postTitle}</h4>
          <span class="tag">${post.data().budgetSheet}</span>
        </div>
        <div class="col-4">
          <h5>${post.data().postAmount} ${post.data().billCurrencyt}</h5>
        </div>

    </article>
    `;
  }
  document.querySelector('#posts').innerHTML = htmlTemplate;
}

// ========== CREATE ==========
// add a new user to firestore (database)
function addPost() {
  // references to the input fields
  let postTitleInput = document.querySelector('#postTitle');
  let postAmountInput = document.querySelector('#postAmount');
  let postBudgetSheetInput = document.querySelector('#budgetSheet');
  //let postIncomeInput = document.querySelector('#postIncome');
  console.log(postTitleInput.value);

  let newPost = {
    postTitle: postTitleInput.value,
    postAmount: postAmountInput.value,
    postBudgetSheet: postBudgetSheetInput.value,
    //find out about checkbox
    //postIncome: postIncomeInput.value,
  };

  postRef.add(newPost);
}

/*
// ========== UPDATE ==========

function selectBill(billTitle, billPost, billAmount, billCurrency ) {}

function updateBill() {}

// ========== DELETE ==========
function deleteBill(id) {}
*/
