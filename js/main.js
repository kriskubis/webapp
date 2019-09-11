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

showPage(loginPage);
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

// ========== BILLS ==========
// watch the database ref for changes
billRef.onSnapshot(function(snapshotData) {
  let bills = snapshotData.docs;
  appendBills(bills);
});

// append bills to the DOM
function appendBills(bills) {
  let htmlTemplate = "";
  for (let bill of bills) {
    console.log(bill.id);
    htmlTemplate += `
    <article class="whiteContainer">
      <h2>${bill.data().billTitle}</h2>
      <p>${bill.data().billPost}</p>
      <p>${bill.data().billAmount}</p>
      <p>${bill.data().billCurrency}</p>
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
    <article class="whiteContainer">
      <h2>${post.data().postTitle}</h2>
      <p>${post.data().postAmount}</p>
      <p>${post.data().budgetSheet}</p>
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
