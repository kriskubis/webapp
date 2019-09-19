"use strict";

// ========== MATH FOR CHARTS ==========
// Income posts in budget
let salBud = 4500; // Salary
let suBud = 3200; //SU

let incBud = (salBud + suBud); // Total income

// Expense posts in budget
let rentBud = 3200;
let foodBud = 1800;
let transBud = 600;
let utilBud = 400;
let uncatBud = 250; // Custom post: Uncategorised
let medBud = 170; // Custom post: Medical
let leisBud = 550; // Custom post: Leisure
let otherBud = (uncatBud + medBud + leisBud);

let expBud = (rentBud + foodBud + transBud + utilBud + otherBud); // Total expenses

// Remaining money once expenses has been subtracted from the income
let remainBud = (incBud - expBud);

// Money spent - for overview
let otherSpent = 625;
let leisSpent = 240;
let transSpent = 320;
let foodSpent = 750;

let spent = 4244;


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
  barChart();
  pieChart();
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
  var page = "expensesPage";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}

setDefaultPage();

// Our web app's Firebase configuration
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

// Database with the collections: bills, posts & users
const db = firebase.firestore();
const billRef = db.collection("bills");
const postRef = db.collection("posts");
const userRef = db.collection("users");

/*
// Firebase UI configuration
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: '#expensesPage',
};
const ui = new firebaseui.auth.AuthUI(firebase.auth());
*/

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


// ========== CREATE USER ==========
function createUser(){
  let createUsernameInput = document.querySelector('#createUsername').value;
  let createPasswordInput = document.querySelector('#createPassword').value;
  let createEmailInput = document.querySelector('#createEmail').value;
  console.log(createUsernameInput.value);
if (createPasswordInput.length >= 6){
firebase.auth().createUserWithEmailAndPassword(createEmailInput, createPasswordInput);
alert("Success");
}
else {alert("Password must contain at least 6 characters");}
}

// ========== LOG IN ==========
function logInUser(){
  let emailInput = document.querySelector('#email').value;
  let passwordInput = document.querySelector('#password').value;
  firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
}

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

// ========== LOG OUT ==========
/*
// sign out user (Not yet implemented)
function logout() {
  firebase.auth().signOut();
}
*/

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


// add a new bill to firestore (database)
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


// ========== CREATE POSTS ==========
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

// add a new post to firestore (database)
function addPost() {
  // references to the input fields
  let postTitleInput = document.querySelector('#postTitle').value;
  let postAmountInput1 = document.querySelector('#postAmount1').value; //first currency (DKK)
  let postAmountInput2 = document.querySelector('#postAmount2').value; //second currency (EUR)
  let postExpenseInput = document.querySelector('#postExpense').value; //choose if expense or income
  let chosenSheetInput = document.querySelector('#chosenSheet').value;
  console.log(postTitleInput.value);

  let newPost = {
    title: postTitleInput,
    amount1: postAmountInput1,
    amount2: postAmountInput2,
    expense: postExpenseInput,
    sheet: chosenSheetInput,
  };

  postRef.add(newPost);
  var page = "budgetPage";
  showPage(page);
}

// ========== CONVERTER ==========
function convert(){
function collectData(url, callback_Function){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200){
            callback_Function(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function showData(jsonData){
     var jsonElements= JSON.parse(jsonData.responseText);
     let currencyResult = document.querySelector("#currencyAmount1").value * jsonElements.rates.DKK;
    document.querySelector("#currencyAmount2").value = currencyResult;
  //  document.querySelector("#currencyAmount2").value = jsonElements;
}

/* Main program */
document.getElementById("convertButton").addEventListener("click", function() {
    let currency1 = document.querySelector("#currency1").value;
    let currency2 = document.querySelector("#currency2").value;
    let amount1 = document.querySelector("#currencyAmount1").value;
    let amount2 = document.querySelector("#currencyAmount2").value;
    let url = `http://data.fixer.io/api/latest?access_key=437dd431bb3d693d631602b9e1df4edd&base = USD&symbols = ${currency1},${currency2}`
    collectData(url, showData);
})
}

// ========== BAR CHART ==========
function barChart(){
  // Data
  let data = {
    labels: ['Food', 'Transport', 'Leisure', 'Other'],
    series: [
      [100, 100, 100, 100],
      [(100/foodBud)*foodSpent, (100/transBud)*transSpent, (100/leisBud)*leisSpent, (100/otherBud)*otherSpent]
    ]
  };

  // Styling
  let options = {horizontalBars: true,
  seriesBarDistance: 0,
  chartPadding: 30,
  axisX: {
    showGrid: false,
    showLabel: false,
    offset: 10
  },
  axisY: {
    offset: 80,
    labelInterpolationFnc: function(value) {
      return (value);
    }
  }};

  // Responsiveness
  let responsiveOptions = [
    ['screen and (min-width: 320px)', {
      chartPadding: 20
    }],
    ['screen and (min-width: 1024px)', {
      chartPadding: 60
    }]
  ];

  // Creating the chart
    new Chartist.Bar('#chart1', data, options, responsiveOptions)
};

// ========== PIE CHART ==========
function pieChart() {
  // Data
  let data = {
    labels: ['Rent', 'Food', 'Transport', 'Utilities', 'Other', 'Remaining'],
    series: [rentBud, foodBud, transBud, transBud, otherBud, remainBud]
  };

  // Styling
  let options = {
    labelInterpolationFnc: function(value) {
      return value[0]
    }
  };

  // Responsiveness
  let responsiveOptions = [
    ['screen and (min-width: 320px)', {
      showLabel:false,
      chartPadding: 20,
      labelOffset: 70,
      labelDirection: 'explode',
      labelInterpolationFnc: function(value) {
        return value;
      }
    }],
    ['screen and (min-width: 1024px)', {
      labelOffset: 20,
      chartPadding: 60
    }]
  ];

  // Creating the chart
  new Chartist.Pie('#chart2', data, options, responsiveOptions);
};

// Timeout for charts to load data
setTimeout(function(){
  barChart();
  pieChart();
}, 3000);


// Budget overviews
function incRemain(){
  document.querySelector("#incomeValue").innerHTML = incBud + " DKK";
  document.querySelector("#remainingValue").innerHTML = remainBud + " DKK";
  document.querySelector("#leftValue").innerHTML = incBud - spent + " DKK";
    document.querySelector("#spentValue").innerHTML =spent + " DKK";
}

incRemain();
