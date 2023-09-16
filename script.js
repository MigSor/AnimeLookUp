const animeSearchInput = document.querySelector("#anime-form-input");
const animeForm = document.querySelector("#anime-form");
const topAnimeContent = document.querySelector(".top-anime-content");
const animeSearchContent = document.querySelector(".anime-search-list");
const animeDetails = document.querySelector(".anime-details");
const selectAnimeSFW = document.querySelector("#animeSFW");
let isSearchSFW;
let animeInfo;

animeForm.addEventListener("submit", searchAnime);

async function fetchAnime(url) {
  const response = await fetch(url);
  const { data } = await response.json();

  return data;
}

async function searchAnime(event) {
  event.preventDefault();
  const baseUrl = `https://api.jikan.moe/v4/anime`;
  let url = `${baseUrl}?q=${animeSearchInput.value}`;
  isAnimeSearchSFW();
  if (isSearchSFW) {
    url = `${baseUrl}?q=${animeSearchInput.value}&sfw`;
  }
  const animeData = await fetchAnime(url);
  console.log("this is the anime data from search", animeData);
  animeSearchInput.value = "";
  animeSearchInput.focus();
  if (animeSearchContent.hasChildNodes()) {
    animeSearchContent.innerHTML = "";
  }

  function isAnimeSearchSFW() {
    selectAnimeSFW.addEventListener("change", () => {
      if (selectAnimeSFW.value) {
        isSearchSFW = true;
      } else {
        isSearchSFW = false;
      }
    });
  }

  const animeCards = renderAnimeCard(animeData);

  if (animeData) {
    animeCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        console.log(e.target);
        getClickedAnimeDetails(card, animeData);
      });
      animeSearchContent.append(card);
    });
  }
}

async function fetchTopAnime() {
  const baseUrl = "https://api.jikan.moe/v4/top/anime";
  const animeData = await fetchAnime(baseUrl);
  const results = renderAnimeCard(animeData);
  const topAnime = animeData.slice(0, 9);

  results.slice(0, 9).map((card, index) => {
    let div = document.createElement("div");
    div.addEventListener("click", () => getClickedAnimeDetails(card, topAnime));
    div.classList.add("card-ranks");
    let p = document.createElement("p");
    p.textContent = index + 1;
    p.classList.add("ranking");
    div.append(p, card);
    return topAnimeContent.append(div);
  });
}

function renderAnimeCard(animeArray) {
  const animeCardArray = animeArray.map((anime) => {
    let link = document.createElement("a");
    link.href = "#anime-details";
    let div = document.createElement("div");
    div.classList.add("anime-card");
    let img = document.createElement("img");
    let p = document.createElement("p");
    img.src = anime.images.jpg.image_url;
    img.alt = anime.title;
    p.textContent = anime.title;

    div.append(img, p);
    link.append(div);
    return link;
  });
  return animeCardArray;
}

function getClickedAnimeDetails(card, topAnime) {
  animeInfo = topAnime.filter((anime) => {
    return anime.title === card.lastElementChild.innerText;
  });
  renderAnimeInfo(animeInfo);
}

function renderAnimeInfo(animeInfo) {
  // clear the section
  animeDetails.innerHTML = "";
  const mainDiv = document.createElement("div");
  const imgDiv = document.createElement("div");
  const infoDiv = document.createElement("div");
  const img = document.createElement("img");
  const synopsisH3 = document.createElement("h3");
  const synopsisParagraph = document.createElement("p");
  const episodesH3 = document.createElement("h3");
  const episodesParagraph = document.createElement("p");
  const ratingH3 = document.createElement("h3");
  const ratingParagraph = document.createElement("p");
  const statusH3 = document.createElement("h3");
  const statusParagraph = document.createElement("p");
  const genresH3 = document.createElement("h3");
  const genresParagraph = document.createElement("p");
  const video = document.createElement("iframe");
  mainDiv.classList.add("anime-info-div");
  imgDiv.classList.add("anime-info-img");
  infoDiv.classList.add("anime-info");

  img.src = animeInfo[0].images.jpg.image_url;
  img.alt = animeInfo.title;

  synopsisH3.innerText = "SYNOPSIS : ";
  infoDiv.append(synopsisH3);
  synopsisParagraph.innerText = animeInfo[0].synopsis;
  infoDiv.append(synopsisParagraph);

  episodesH3.innerText = "EPISODES : ";
  infoDiv.append(episodesH3);
  episodesParagraph.innerText = animeInfo[0].episodes;
  infoDiv.append(episodesParagraph);

  ratingH3.innerText = "RATING : ";
  infoDiv.append(ratingH3);
  ratingParagraph.innerText = animeInfo[0].rating;
  infoDiv.append(ratingParagraph);

  statusH3.innerText = "STATUS : ";
  infoDiv.append(statusH3);
  statusParagraph.innerText = animeInfo[0].status;
  infoDiv.append(statusParagraph);

  if (animeInfo[0].trailer.embed_url) {
    video.src = animeInfo[0].trailer.embed_url;
    video.width = "100%";
    video.height = "320";
    imgDiv.append(img, video);
  } else {
    img.style.height = "100%";
    imgDiv.append(img);
  }

  genresH3.innerText = "GENRES : ";
  infoDiv.append(genresH3);
  animeInfo[0].genres.forEach((element) => {
    const span = document.createElement("span");
    span.innerText = element.name + ", ";
    genresParagraph.append(span);
  });
  infoDiv.append(genresParagraph);
  //   add to the div

  mainDiv.append(imgDiv, infoDiv);
  //   add to the webpage
  animeDetails.append(mainDiv);
}

function addAnimeInfo(heading, info) {}

window.addEventListener("load", async () => {
  let loadingImg = document.createElement("img");
  loadingImg.src = "./assets/images/loading.gif";
  loadingImg.alt = "loading top anime";
  loadingImg.style.margin = "0 auto";
  topAnimeContent.append(loadingImg);
  // Wait for the Promise to finish before continuing
  await Promise.all([fetchTopAnime()]);
  loadingImg.style.display = "none";
});
