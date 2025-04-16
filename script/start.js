// Ikoner
const spelare = '<img src="../images/icon1.png" class="ikon">';
const katt = '<img src="../images/icon2.png" class="ikon2">';
const gurli = '<img src="../images/icon3.png" class="ikon3">';




let spelarPlats = 12;
let kattPlats;
let gurliPlats;
let låst = false;
let vinnarPlats;
let fyrverkeriInterval = null;


const spelbildElement = document.querySelector(".spelbild");


const startBild = "b0.png";

// Övriga bilder
const övrigaBilder = Array.from({ length: 24 }, (_, i) => `b${i + 1}.png`);

// Blanda bilder
const blandadeÖvrigaBilder = övrigaBilder.sort(() => Math.random() - 0.5);
let bildkarta = [];

for (let i = 0; i < 25; i++) {
  bildkarta[i] = i === 12 ? startBild : blandadeÖvrigaBilder.pop();
}

// Hitta vinnarbild
vinnarPlats = bildkarta.findIndex((bild) => bild === "b3.png");

function uppdateraSpelbild() {
  spelbildElement.src = `../images/${bildkarta[spelarPlats]}`;
}




window.onload = () => {
  const rutor = document.querySelectorAll(".ruta");

  function slumpaRuta(exkluderade) {
    let nummer;
    do {
      nummer = Math.floor(Math.random() * 25);
    } while (exkluderade.includes(nummer));
    return nummer;
  }

  kattPlats = slumpaRuta([spelarPlats]);
  gurliPlats = slumpaRuta([spelarPlats, kattPlats]);

  function uppdateraRutnät() {
    rutor.forEach((ruta, index) => {
      ruta.innerHTML = "";
      if (index === spelarPlats) ruta.innerHTML = spelare;
      if (index === kattPlats) ruta.innerHTML = katt;
      if (index === gurliPlats) ruta.innerHTML = gurli;
    });
  }

  uppdateraRutnät();
  uppdateraSpelbild();



  function flyttaFigur(plats) {
    const riktningar = [];
    if (plats >= 5) riktningar.push(-5); // Upp
    if (plats <= 19) riktningar.push(5); // Ner
    if (plats % 5 !== 0) riktningar.push(-1); // Vänster
    if (plats % 5 !== 4) riktningar.push(1); // Höger

    let nyPlats;
    do {
      const steg = riktningar[Math.floor(Math.random() * riktningar.length)];
      nyPlats = plats + steg;
    } while ([spelarPlats, gurliPlats, kattPlats].includes(nyPlats));
    return nyPlats;
  }



  window.flyttaSpelare = function (riktning) {
    if (låst) return;

    let nyPlats = spelarPlats;
    if (riktning === "Upp" && nyPlats >= 5) nyPlats -= 5;
    else if (riktning === "Ner" && nyPlats <= 19) nyPlats += 5;
    else if (riktning === "Vänster" && nyPlats % 5 !== 0) nyPlats -= 1;
    else if (riktning === "Höger" && nyPlats % 5 !== 4) nyPlats += 1;

    if (nyPlats === kattPlats) return;





    //Om man hamnar i samtal med Gurli
    if (nyPlats === gurliPlats) {
      låst = true;
      spelarPlats = nyPlats;
      uppdateraRutnät();
      uppdateraSpelbild();
      visaPopup();
    
      // Tassie flyttar sig 1 steg
      setTimeout(() => {
        kattPlats = flyttaFigur(kattPlats);
        uppdateraRutnät();
    
        if (kattPlats === vinnarPlats) {
          visaKattVinst();
        }
      }, 2000); // väntar i 2sek
    
      return;
    }
    





    spelarPlats = nyPlats;
    uppdateraSpelbild();
    kattPlats = flyttaFigur(kattPlats);
    gurliPlats = flyttaFigur(gurliPlats);
    uppdateraRutnät();

    if (spelarPlats === vinnarPlats) {
      visaSpelarVinst();
    } else if (kattPlats === vinnarPlats) {
      visaKattVinst();
    }
  };
};





//Popup Gurli

function visaPopup() {
  const popup = document.getElementById("gurliePopup");
  const nedräkning = document.getElementById("nedräkning");
  const stangX = document.getElementById("stangX");

  popup.style.display = "block";
  stangX.style.display = "none";

  let tid = 5;
  nedräkning.textContent = tid;

  const nedräknare = setInterval(() => {
    tid--;
    nedräkning.textContent = tid;
    if (tid === 0) {
      clearInterval(nedräknare);
      stangX.style.display = "inline";
    }
  }, 1000);
}

function stangPopup() {
  document.getElementById("gurliePopup").style.display = "none";
  låst = false;
}





// Spelaren vinner
function visaSpelarVinst() {
  document.getElementById("spelareVinnerPopup").style.display = "block";
  låst = true;
  startaFyrverkerier();
}


//Tassie vinner
function visaKattVinst() {
  document.getElementById("kattVinnerPopup").style.display = "block";
  låst = true;
}






//Fyverkerier

function startaFyrverkerier() {
  const container = document.getElementById("fyrverkeri-container");

  if (fyrverkeriInterval) return;

  fyrverkeriInterval = setInterval(() => {
    for (let i = 0; i < 5; i++) {
      const gnista = document.createElement("div");
      gnista.classList.add("fyrverkeri");
      gnista.style.left = Math.random() * window.innerWidth + "px";
      gnista.style.top = Math.random() * window.innerHeight + "px";
      gnista.style.backgroundColor = slumpFärg();
      container.appendChild(gnista);

      setTimeout(() => {
        gnista.remove();
      }, 1000);
    }
  }, 400);
}

function stoppaFyrverkerier() {
  clearInterval(fyrverkeriInterval);
  fyrverkeriInterval = null;
  document.getElementById("fyrverkeri-container").innerHTML = "";
}

function slumpFärg() {
  const färger = ["#ff99c8", "#fcf6bd", "#d0f4de", "#a9def9", "#e4c1f9"];
  return färger[Math.floor(Math.random() * färger.length)];
}
