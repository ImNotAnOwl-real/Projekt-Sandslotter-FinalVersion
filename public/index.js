// const bruger = require("../models/bruger");

async function post(url, objekt) {
  const respons = await fetch(url, {
    method: "POST",
    body: JSON.stringify(objekt),
    headers: { 'Content-Type': 'application/json' }
  });
  if (respons.status !== 200) // Created
    throw new Error(respons.status);
  return await respons.json();
}

async function get(url) {
  const respons = await fetch(url);
  if (respons.status !== 200) // OK
    throw new Error(respons.status);
  return await respons.json();
}

let sumbitKnap = document.getElementById("submit")

sumbitKnap.addEventListener('click', async (event) => {
  if (!event.isTrusted) return
  try {
    event.preventDefault()
    let usernamevalue = document.getElementById("usernameInput").value
    let passwordvalue = document.getElementById("passwordInput").value

    if (usernamevalue == "" || passwordvalue == "") {
      let ok = document.getElementById("oklogin")
      ok.innerHTML = "Venligst indtast både password og username"
      ok.style.color = "red"
      return;
    }

    let loginStatus = await post('loginBruger', { username: usernamevalue, password: passwordvalue });

    if (loginStatus === true) {
      window.location.href = "/loginBruger/session";
    } else {
      alert("Forkert username eller password");
    }
  } catch (err) {
    console.error(err) // or alert it, or put the message on the page
  }
})
