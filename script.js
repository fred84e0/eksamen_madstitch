var burgerMenu = document.querySelector("#menu-left");
document.querySelector("#burger-button").addEventListener("click", openSidebar);

let billeder = [];
let gallery = [];
let events = [];
let filter = "alle";


document.addEventListener("DOMContentLoaded", hentJson);

function openSidebar() {
    console.log("nu kører det");


    if (!(burgerMenu.style.display == "block")) {
        burgerMenu.style.display = "block";
    } else {
        burgerMenu.style.display = "none";
    }

}
async function hentJson() {
    const url = "http://home8.dk/kea/semester2/cms/madstitch/wordpress/wp-json/wp/v2/img"
    const myJson = await fetch(url);
    billeder = await myJson.json();
    hentJson2();
    hentJson3();
    visbilleder();
}

function visbilleder() {
    let temp = document.querySelector("template");
    let dest = document.querySelector("#img-container");
    document.querySelector("#img-container").innerHTML = "";
    billeder.forEach(billede => {
        let klon = temp.cloneNode(true).content;
        klon.querySelector(".img1").src = billede.index_billede.guid;
        klon.querySelector(".img1").alt = billede.billede_beskrivelse;
        klon.querySelector(".billede_navn").innerHTML = billede.billede_navn;
        dest.appendChild(klon);
    })

    console.log(billeder);
}

async function hentJson2() {
    const url2 = "http://home8.dk/kea/semester2/cms/madstitch/wordpress/wp-json/wp/v2/gallery"
    const myJson = await fetch(url2);
    gallery = await myJson.json();
    console.log("hentet Json2");
    visgallery();
}

function visgallery() {
    let temp = document.querySelector("#gallery_temp");
    console.log(gallery);
    let dest = document.querySelector(".masonry_gallery");
    document.querySelector(".masonry_gallery").innerHTML = "";
    gallery.forEach(galleri => {
        let klon = temp.cloneNode(true).content;
        klon.querySelector(".item").src = galleri.galleri.guid;
        klon.querySelector(".item").alt = galleri.billede_beskrivelse;
        dest.appendChild(klon);
        dest.lastElementChild.addEventListener("click", () => {
            visSingleGalleri(galleri);
        })

    })
}

function visSingleGalleri(galleri) {

    document.querySelector(".indhold").innerHTML = `<article class="galleri_billede"><img class="billede" src="${galleri.galleri.guid}" alt="${galleri.billede_beskrivelse}"></article>`;
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".popup .luk").addEventListener("click", close);

}

function close() {
    document.querySelector(".popup").style.display = "none";
}



async function hentJson3() {
    const url = "http://home8.dk/kea/semester2/cms/madstitch/wordpress/wp-json/wp/v2/events"
    const myJson = await fetch(url);
    events = await myJson.json();
    //--------------------------- sortere arrayet, så de nye posts er i toppen
    events.sort((a, b) => {
        return a.dato.localeCompare(b.dato);
    })
    console.log("url fanget")
    visevents();
}

function visevents() {
    console.log("klar til events");
    let dest = document.querySelector(".event_container");
    let temp = document.querySelector("#event_template");
    //------------------------- fjerner indhold så filtrering kan finde sted
    document.querySelector(".event_container").innerHTML = "";
    events.forEach(event => {
        //------------------------- Filtrere enten efter alle posts eller en af muserne
        if (filter == "alle" || filter == event.sted[0]) {
            //----------- her kloner vi hver af elementerne i templaten 
            let klon = temp.cloneNode(true).content;
            klon.querySelector(".event_overskrift").innerHTML = event.overskrift;
            klon.querySelector(".event_tekst").innerHTML = event.kort_tekst;
            klon.querySelector(".event_dato").innerHTML = event.dato;
            klon.querySelector(".event_sted").innerHTML = event.sted;
            klon.querySelector(".event_billede").style.backgroundImage = `url(${event.billede.guid})`
            klon.querySelector(".event_billede").alt = event.billede_beskrivelse;
            dest.appendChild(klon);
            //------------------------- sætter en listener på alle posts, da de på et tidspunkt er det sidste post i loopet.
            dest.lastElementChild.addEventListener("click", () => {
                // kommer ind på siden alt efter dens id.
                visEnkeltEvent(event);
            });
        }
    })

    applyClass();

}

function visEnkeltEvent(event) {

    document.querySelector(".indhold").innerHTML = `<article class="enkelt_event"><img class="billede" src="${event.billede.guid}" alt="${event.billede_beskrivelse}">
<h2>${event.overskrift}</h2>
<p>${event.lang_tekst}</p>
</article>`;
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".popup .luk").addEventListener("click", close);

}

//
//function applyClass() {
//    // her vælger vi den udenom læggende div som vores event posts fra Wordpress kommer ind i. 
//    let ul = document.querySelector(".event_container");
//    // her fortæller vi der skal tælles child elemmenter, og at hver andet child skal have classen float_right
//    for (let i = 0; i < ul.childElementCount; i = i + 2) {
//        ul.children[i].classList.toggle("float_right");
//    }
//    farveKat();
//}
//
//function farveKat() {
//    console.log("farvekat igang");
//    //Her vælger vi  som dækker over de 3 landsdele. 
//    var farveKategorier = document.querySelectorAll(".event_sted");
//    console.log(farveKategorier);
//    // hvergang den støder på en landsdels navn, alt efter hvilket, tildeles en css class ud af 3, som ændre farven.
//    farveKategorier.forEach(function (em) {
//        if (em.textContent == "Sjaelland")
//            em.classList.add("sjaelland");
//        else if (em.textContent == "Fyn")
//            em.classList.add("fyn");
//        else if (em.textContent == "Jylland")
//            em.classList.add("jylland");
//    })
//}

//---------------------- Her kommer filter funktion!------------------------
document.querySelectorAll(".filter").forEach(elm => {
    // funktionen filtering skal startes ligegyldigt hvilken knap man trykker.
    elm.addEventListener("click", filtering);
});


function filtering() {
    console.log("filter-click");
    // data- kan holde information og her siger vi den information skal være den sammen som den trykkede knaps.
    filter = this.getAttribute("data-kat");
    // her viser vi den valgte tekst på siden
    document.querySelector("#filter_tekst").textContent = this.textContent;
    // valgt classen sidder på "alle" knappen i starten, så når der trykkes på alle knapperne, skal den fjernes.
    document.querySelectorAll(".filter").forEach(elm => {
        elm.classList.remove("valgt");
    });
    // og sættes på den valgte knap!
    this.classList.add("valgt");
    console.log("valgt!", filter);
    visevents();
}
