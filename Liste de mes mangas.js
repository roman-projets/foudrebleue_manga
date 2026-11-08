function reload(re) {
    if (re === "rechargement") {
        location.reload();
    }
}

let menuMobileOuvert = false;
let menuDesktopOuvert = false;

function menu() {
    const menu = document.getElementById("menu");
    const menu_btn = document.querySelector(".menu-btn");

    if (!menuMobileOuvert) {
        menu.style.display = "flex";
        menu_btn.src = "Croix.svg";
        menuMobileOuvert = true;
    } else {
        menu.style.display = "none";
        menu_btn.src = "Menu.svg";
        menuMobileOuvert = false;
    }
}
function menu_pc() {
    const menu = document.getElementById("menu_ordi");
    const arrow = document.getElementById("rotation1");

    if (!menuDesktopOuvert) {
        menu.style.display = "flex";
        arrow.style.transform = "rotate(180deg)";
        menuDesktopOuvert = true;
    } else {
        menu.style.display = "none";
        arrow.style.transform = "rotate(0deg)";
        menuDesktopOuvert = false;
    }
}

// function deploye(infos) {
//     const chevron = document.querySelector(".developpe_manga");
//     const plus = document.querySelector(".masquer");
//     if (infos === 'plus') {
//         plus.classList.toggle("ouvert");
//         chevron.classList.toggle("rotation");
//     }
// }

function deploye(titre) {

    // Le chevron du titre cliqué
    const chevron = titre.querySelector(".developpe_manga");

    // La liste de tomes située juste après le h2
    const liste = titre.nextElementSibling;

    // Le bloc masqué contenu dans cette liste
    const plus = liste.querySelector(".masquer");

    plus.classList.toggle("ouvert");
    chevron.classList.toggle("rotation");
}

let etatCourant = "all";
let absentsActif = false;

function filterMangas(etat, bouton) {

    etatCourant = etat;

    // Désélectionne tous les boutons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    // Sélectionne le bouton cliqué
    bouton.classList.add("active");

    appliquerFiltres();
}

function appliquerFiltres() {
    const vendre = document.getElementById("FilterVendre").value;
    const lettre = document.getElementById("FilterLetter").value;
    const type = document.getElementById("typeFilter").value;
    const edition = document.getElementById("editionFilter").value;

    document.querySelectorAll(".info_manga").forEach(manga => {
        const matchFavoris =
            !favorisActif || manga.dataset.favoris === "oui";
        // Filtre type
        const matchType =
            !type || manga.dataset.type === type;

        // Filtre éditeur
        const matchEdition =
            !edition || manga.dataset.edition === edition;

        // Filtre lettre
        const section = manga.closest(".section_manga");

        const matchLettre =
            !lettre ||
            (section && normaliserTexte(section.dataset.letter) === normaliserTexte(lettre));

        // Filtre recherche
        const recherche = normaliserTexte(
            document.getElementById("searchFilter").value
        );

        const titre = normaliserTexte(
            manga.querySelector("h2").textContent
        );

        const matchRecherche =
            !recherche || titre.includes(recherche);
        // Filtre À vendre
        const matchVendre =
            !vendre || manga.querySelector(".filigrane") !== null;
        // Filtre état
        let matchEtat = false;

        manga.querySelectorAll(".align").forEach(tome => {

            const status = tome.dataset.status;

            const matchAbsents =
                !absentsActif ||
                tome.dataset.possession === "prete";

            const visible =
                (etatCourant === "all" || status === etatCourant)
                && matchAbsents;

            tome.style.display = visible ? "" : "none";

            if (visible) {
                matchEtat = true;
            }

        });

        // Affichage du manga
        manga.style.display =
            (
                matchType &&
                matchEdition &&
                matchLettre &&
                matchRecherche &&
                matchEtat &&
                matchFavoris &&
                matchVendre
            )
                ? ""
                : "none";

    });

    // Masquer les sections vides
    document.querySelectorAll(".section_manga").forEach(section => {

        const mangasVisibles = section.querySelectorAll(
            '.info_manga:not([style*="display: none"])'
        );

        section.style.display =
            mangasVisibles.length ? "" : "none";

    });

    // Affichage des groupes de statut
    document.querySelectorAll(".status-group").forEach(group => {

        group.style.display =
            etatCourant === "all" ||
                group.dataset.status === etatCourant
                ? ""
                : "none";

    });



    const mangasVisibles = document.querySelectorAll(
        '.info_manga:not([style*="display: none"])'
    );

    document.getElementById("aucunResultat").style.display =
        mangasVisibles.length ? "none" : "block";


    compteurMangas();


}

function compteurMangas() {

    let total = 0;
    let lus = 0;
    let enCours = 0;
    let aLire = 0;

    document.querySelectorAll(".info_manga").forEach(manga => {

        if (manga.style.display !== "none") {

            manga.querySelectorAll(".align").forEach(tome => {

                if (tome.style.display !== "none") {

                    total++;

                    const status = tome.dataset.status;

                    if (status === "lu") {
                        lus++;
                    }

                    else if (status === "en-cours") {
                        enCours++;
                    }

                    else if (status === "a-lire") {
                        aLire++;
                    }
                }

            });
        }

    });

    let series = 0;

    document.querySelectorAll(".info_manga").forEach(manga => {

        if (manga.style.display !== "none") {

            series++;
        }

    });

    document.getElementById("compteur").innerHTML =
        `•📚 ${total} Tomes <br> •📔 ${series} séries <br> •✔️ ${lus} Lus <br> •🔄 ${enCours} En cours <br> •📖 ${aLire} À lire`;

    console.log({
        total,
        lus,
        enCours,
        aLire
    });
}

let favorisActif = false;

document.getElementById("favoris").addEventListener("click", () => {

    favorisActif = !favorisActif;

    document.getElementById("favoris").classList.toggle("actif");

    appliquerFiltres();

});

document.getElementById("absents").addEventListener("click", () => {

    absentsActif = !absentsActif;

    document.getElementById("absents").classList.toggle("actif");

    appliquerFiltres();

});

function normaliserTexte(texte) {
    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

appliquerFiltres()