const animeSearchInput = document.querySelector("#anime-form-input");
const animeForm = document.querySelector("#anime-form");
const topAnimeContent = document.querySelector(".top-anime-content");
const animeSearchContent = document.querySelector(".anime-search-list");
const animeDetails = document.querySelector(".anime-details");
const selectAnimeSFW = document.querySelector("#animeSFW");
const favoriteList = document.querySelector("#favorite");
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

  //reset style to grid
  animeSearchContent.style.display = "grid";
  const baseUrl = `https://api.jikan.moe/v4/anime`;
  let url;
  // isAnimeSearchSFW();
  if (selectAnimeSFW.value === "true") {
    url = `${baseUrl}?q=${animeSearchInput.value}&sfw`;
  } else if (selectAnimeSFW.value === "false") {
    url = `${baseUrl}?q=${animeSearchInput.value}`;
  }

  const animeData = await fetchAnime(url);
  console.log("this is the anime data from search", animeData);
  animeSearchInput.value = "";
  animeSearchInput.focus();
  if (animeSearchContent.hasChildNodes()) {
    animeSearchContent.innerHTML = "";
  }

  const animeCards = renderAnimeCard(animeData);

  if (animeData) {
    animeCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        getClickedAnimeDetails(card, animeData);
      });
      animeSearchContent.append(card);
    });
  }
  if (!animeSearchContent.hasChildNodes()) {
    let h2 = document.createElement("h2");
    animeSearchContent.style.display = "flex";
    h2.innerText = "Sorry, your search have no results...";
    animeSearchContent.append(h2);
  }
  animeSearchContent.scrollIntoView({
    behavior: "smooth",
  });
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

async function getStreamingService(animeInfo) {
  ////////////////
  console.log("I want to see where this can be wathced", animeInfo[0].mal_id);
  let streamingURL = `https://api.jikan.moe/v4/anime/${animeInfo[0].mal_id}/streaming`;
  let response = await fetch(streamingURL);
  let { data } = await response.json();
  const streamingServicesName = data.map((element) => element.name);
  console.log("the streaming services available:", data);

  return streamingServicesName;
  ////////////////
}

async function renderAnimeInfo(animeInfo) {
  animeDetails.innerHTML = "";
  let streamingServices = await getStreamingService(animeInfo);
  const mainDiv = document.createElement("div");
  const imgDiv = document.createElement("div");
  const img = document.createElement("img");
  const video = document.createElement("iframe");
  mainDiv.classList.add("anime-info-div");
  imgDiv.classList.add("anime-info-img");

  img.src = animeInfo[0].images.jpg.image_url;
  img.alt = animeInfo[0].title;
  const mainInfoDiv = document.createElement("div");
  mainInfoDiv.classList.add("main-info-div");
  const animeSynopsis = addAnimeInfo("SYNOPSIS :", animeInfo[0].synopsis);
  const animeEpisodes = addAnimeInfo("EPISODES :", animeInfo[0].episodes);
  const animeRating = addAnimeInfo("RATING : ", animeInfo[0].rating);
  const animeStatus = addAnimeInfo("STATUS :", animeInfo[0].status);
  let genres = animeInfo[0].genres.map((element) => {
    return element.name;
  });

  const streamingServicesList = addAnimeInfo(
    "AVAILABLE TO STREAM : ",
    streamingServices
  );

  const animeGenres = addAnimeInfo("GENRES : ", genres);
  const favoriteBtn = document.createElement("button");
  favoriteBtn.classList.add("favorite-button");
  favoriteBtn.innerText = "ADD TO FAVORITES 🥰";
  console.log("chosen anime title", animeInfo[0].title);
  favoriteBtn.addEventListener("click", () =>
    addToFavoriteList(animeInfo[0].title)
  );

  mainInfoDiv.append(
    animeSynopsis,
    animeEpisodes,
    animeRating,
    animeStatus,
    animeGenres,
    streamingServicesList,
    favoriteBtn
  );

  if (animeInfo[0].trailer.embed_url) {
    video.src = animeInfo[0].trailer.embed_url;
    video.width = "100%";
    video.height = "320";
    imgDiv.append(img, video);
  } else {
    img.style.height = "100%";
    imgDiv.append(img);
  }

  mainDiv.append(imgDiv, mainInfoDiv);
  //   add to the webpage
  animeDetails.append(mainDiv);
}

function addAnimeInfo(heading, info) {
  const animeDetailsHeading = document.createElement("h3");
  const animeDetailsInfo = document.createElement("p");
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("anime-info");
  animeDetailsHeading.innerText = `${heading}`;
  infoDiv.append(animeDetailsHeading);
  animeDetailsInfo.innerText = info;
  infoDiv.append(animeDetailsInfo);
  return infoDiv;
}

function addToFavoriteList(animeName) {
  const favoriteAnime = document.createElement("option");
  favoriteAnime.value = animeName;
  favoriteAnime.innerText = animeName;
  favoriteList.append(favoriteAnime);
}

function searchByFavoriteList() {
  const baseUrl = `https://api.jikan.moe/v4/anime`;
  favoriteList.addEventListener("change", function (e) {
    animeSearchContent.innerHTML = "";
    // console.log(e.target.value);
    url = `${baseUrl}?q=${e.target.value}`;
    fetch(url)
      .then((response) => response.json())
      .then(({ data }) => {
        console.log(data);
        let cards = renderAnimeCard(data);
        cards.forEach((card) => {
          card.addEventListener("click", (e) => {
            getClickedAnimeDetails(card, data);
          });
          animeSearchContent.append(card);
        });
      });
    animeSearchContent.scrollIntoView({
      behavior: "smooth",
    });
  });

  // async function fetchAnime(url) {
  //   const response = await fetch(url);
  //   const { data } = await response.json();

  //   return data;
  // }
}

window.addEventListener("load", async () => {
  let loadingImg = document.createElement("img");
  loadingImg.src = "./assets/images/loading.gif";
  loadingImg.alt = "loading top anime";
  loadingImg.style.margin = "0 auto";
  topAnimeContent.append(loadingImg);
  // Wait for the Promise to finish before continuing
  await Promise.all([fetchTopAnime()]);
  loadingImg.style.display = "none";
  searchByFavoriteList();
});
