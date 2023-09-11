const animeSearchInput = document.querySelector("#anime-form-input");
const animeForm = document.querySelector("#anime-form");
const topAnimeContent = document.querySelector(".top-anime-content");
const animeSearchContent = document.querySelector(".anime-search-list");
const animeDetails = document.querySelector(".anime-details");

animeForm.addEventListener("submit", searchAnime);

async function fetchAnime(url) {
  const response = await fetch(url);
  const { data } = await response.json();

  return data;
}

async function searchAnime(event) {
  event.preventDefault();
  const baseUrl = `https://api.jikan.moe/v4/anime`;
  const url = `${baseUrl}?q=${animeSearchInput.value}`;
  const animeData = await fetchAnime(url);
  animeSearchInput.value = "";
  animeSearchInput.focus();
  if (animeSearchContent.hasChildNodes()) {
    animeSearchContent.innerHTML = "";
  }

  const animeCards = renderAnimeCard(animeData);
  animeCards.map((card) => {
    return animeSearchContent.append(card);
  });
}

async function fetchTopAnime() {
  const baseUrl = "https://api.jikan.moe/v4/top/anime";
  const animeData = await fetchAnime(baseUrl);
  const results = renderAnimeCard(animeData);
  const topAnime = animeData.slice(0, 9);
  console.log(topAnime);
  results.slice(0, 9).map((card, index) => {
    let div = document.createElement("div");
    div.addEventListener("click", function () {
      topAnime.filter(
        (anime) => anime.title === card.lastElementChild.innerText
      );
    });
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
    let div = document.createElement("div");
    div.classList.add("anime-card");
    let img = document.createElement("img");
    let p = document.createElement("p");
    img.src = anime.images.jpg.image_url;
    img.alt = anime.title;
    p.textContent = anime.title;
    div.append(img, p);
    return div;
  });
  return animeCardArray;
}

topAnimeContent.addEventListener("load", fetchTopAnime());
