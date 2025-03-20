// // playlistCollection
import { playlistCollection } from "./playlist.js";

// initiating the app right here
function initiateApp() {
  //accessing the DOM
  const allMusicContainer = document.getElementById("all-songs");
  const toggleBtnEle = document.getElementById("toggle-btn");
  const themeBtnEle = document.getElementById("theme-toggle-btn");
  const createPlaylistEle = document.getElementById("add-playlist-btn");
  const playListEle = document.getElementById("playlist-list");
  const mediaPlayerCover = document.querySelector(".song-content > img");
  const mediaPlayerTitle = document.querySelector(".song-info > .title");
  const mediaPlayerArtist = document.querySelector(".song-info > .artist");
  const progressBarEle = document.getElementById("progress-bar");
  const progressBarOuter = document.querySelector(".progress-bar-box");
  const playlistModalEle = document.querySelector(".playlistModal");
  const playlistItem = document.querySelector(".playlist-item");
  const closePlaylistModalBtn = document.querySelector(".close-modal-btn");
  const mediaPlayerEle = document.querySelector(".media-player");
  const barSettingOption = document.getElementById("bar-setting-option");
  const volumeBtn = document.querySelector(".volume-control");
  const volumeControl = document.querySelector(".control-box");
  const volumeSlider = document.querySelector(".volume-slider-bar");
  const volumeHandle = document.getElementById("volume-handle");
  const selectGenre = document.getElementById("select-genre");

  // accessing previous play and next buttons
  const prevBtn = document.getElementById("prevBtn");
  const playBtn = document.getElementById("playBtn");
  const nextBtn = document.getElementById("nextBtn");

  // music audio
  let music = new Audio();

  // music index and flag to check whether the music is working or not
  let isPlaying = false;
  let currentSongIndex = 0;
  let playlistSongsArray = [];
  let playlistSongsFlag = false;
  let playlistSongsIndex = 0;
  let playlistRenderedsongs = 0;
  let FilterSongCollection = [];

  let allSongs = [];
  let changeMusicSongs = [];

  async function fetchSongs() {
    try {
      const response = await fetch("songs.json");
      allSongs = await response.json();
      changeMusicSongs = allSongs;
      generateSongsCard(allSongs);
      generateGenreOptions(allSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  }
  fetchSongs();

  // adding available genres in the filter options and creating filters dynamically
  function generateGenreOptions(songs) {
    const genres = new Set(songs.map((song) => song.genre)); // Unique genres
    selectGenre.innerHTML = `<option value="all">All Genres</option>`; // Default option

    genres.forEach((genre) => {
      selectGenre.insertAdjacentHTML(
        "beforeend",
        `<option value="${genre}">${genre}</option>`
      );
    });
  }

  // Filtering songs based on selected genre
  selectGenre.addEventListener("change", (e) => {
    const selectedGenre = e.target.value;
    const filteredSongs =
      selectedGenre === "all"
        ? allSongs
        : allSongs.filter((song) => song.genre === selectedGenre);

    allMusicContainer.innerHTML = ""; // Clear existing songs
    changeMusicSongs = filteredSongs;
    generateSongsCard(filteredSongs);
  });

  // creating dynamic songs card
  function generateSongsCard(data) {
    document.getElementById(
      "total-songs"
    ).textContent = `total songs : ${data.length}`;
    data.forEach((song) => {
      const card = document.createElement("div");
      card.classList.add("card");

      // album cover div element creation
      const albumCoverEle = document.createElement("div");
      albumCoverEle.classList.add("album-cover");
      const imageEle = document.createElement("img");
      imageEle.src = song.imgurl;
      albumCoverEle.appendChild(imageEle);

      // album content div element creation
      const albumContentEle = document.createElement("div");
      albumContentEle.classList.add("album-content");

      // creating artist details elementsuing js
      const artistDetailsEle = document.createElement("div");
      artistDetailsEle.classList.add("artist-details");

      // creating setting option icon
      const settingOption = document.createElement("div");
      settingOption.classList.add("setting-option");
      const spanEle = document.createElement("span");
      const iEle = document.createElement("i");
      iEle.classList.add("fa-solid", "fa-ellipsis-vertical");

      // creating options for setting-options
      const optionBoxEle = document.createElement("ul");
      optionBoxEle.classList.add("option-box");

      const saveToPlaylistOpt = document.createElement("li");
      saveToPlaylistOpt.textContent = "Add to Playlist";
      saveToPlaylistOpt.classList.add("avail-opt");
      saveToPlaylistOpt.setAttribute("id", "save-to-playlist-opt");

      const removeFromPlaylistOpt = document.createElement("li");
      removeFromPlaylistOpt.textContent = "Remove";
      removeFromPlaylistOpt.classList.add("avail-opt");
      removeFromPlaylistOpt.setAttribute("id", "remove-song-opt");

      const sharePlaylistOpt = document.createElement("li");
      sharePlaylistOpt.textContent = "Share";
      sharePlaylistOpt.classList.add("avail-opt");
      sharePlaylistOpt.setAttribute("id", "share-song-opt");

      optionBoxEle.appendChild(saveToPlaylistOpt);
      optionBoxEle.appendChild(removeFromPlaylistOpt);
      optionBoxEle.appendChild(sharePlaylistOpt);
      settingOption.appendChild(optionBoxEle);

      // adding event listener for setting controls
      settingOption.addEventListener("click", () =>
        showSettingOptions(optionBoxEle)
      );

      saveToPlaylistOpt.addEventListener("click", () =>
        openPlaylistModal(song)
      );

      // song element creation
      const songNameEle = document.createElement("div");
      songNameEle.classList.add("song-name", "sub-heading");
      songNameEle.textContent = song.name;

      // artist element creation
      const artistNameEle = document.createElement("div");
      artistNameEle.classList.add("artist-name", "sub-heading");
      artistNameEle.textContent = song.artistName;

      // appending song and artist name in artist details
      artistDetailsEle.appendChild(songNameEle);
      artistDetailsEle.appendChild(artistNameEle);
      albumContentEle.appendChild(artistDetailsEle);

      // appending setting option
      spanEle.appendChild(iEle);
      settingOption.appendChild(spanEle);
      albumContentEle.appendChild(settingOption);

      // albumContentEle.appendChild(audioEle);

      // appending albul album cover and album content
      card.appendChild(albumCoverEle);
      card.appendChild(albumContentEle);

      // appending card in all music container
      allMusicContainer.insertAdjacentElement("beforeend", card);
      albumCoverEle.addEventListener("click", () =>
        functionPlayFromLiberary(song, song.id)
      );
    });
  }

  // Load a song into the player

  function functionPlayFromLiberary(song, id) {
    playlistSongsFlag = false;
    loadMusic(song, id);
  }

  // Load a song into the player
  function loadMusic(song, id) {
    if (playlistSongsFlag) {
      playlistSongsIndex = id;
    } else {
      currentSongIndex = id;
    }
    music.src = song.path;
    playMusic();
    mediaPlayerCover.src = song.imgurl;
    mediaPlayerTitle.textContent = song.name;
    mediaPlayerArtist.textContent = song.artistName;
    mediaPlayerEle.classList.add("active");
  }

  // Toggle play/pause
  function togglePlay() {
    isPlaying ? pauseMusic() : playMusic();
  }

  // Play music
  function playMusic() {
    isPlaying = true;
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
    music.play();
  }

  // Pause music
  function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace("fa-pause", "fa-play");
    playBtn.setAttribute("title", "Play");
    music.pause();
  }

  // Change song
  async function changeMusic(direction) {
    let renderedSongs;
    if (playlistSongsFlag) {
      renderedSongs = playlistRenderedsongs;
    } else {
      renderedSongs = changeMusicSongs;
    }

    // Ensure songs array exists and is not empty
    if (!renderedSongs || renderedSongs.length === 0) return;

    // Update song index
    currentSongIndex += direction;

    // Loop around if we reach the end/start
    if (currentSongIndex >= renderedSongs.length) {
      currentSongIndex = 0;
    } else if (currentSongIndex < 0) {
      currentSongIndex = renderedSongs.length - 1;
    }
    loadMusic(renderedSongs[currentSongIndex], currentSongIndex);
  };

  // supdating progress bar
  function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progressBarEle.style.width = `${progressPercent}%`;
  };

  // chaning the progress bar on the clicks
  function setProgressBar(e) {
    const width = progressBarOuter.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
  }

  // Default volume set to 50% initially
  let initialVolume = 0.5;
  music.volume = initialVolume;

  // Function to update volume UI
  function updateVolumeUI(volume) {
    let percentage = music.muted ? 0 : volume * 100;
    volumeHandle.style.top = `${100 - percentage}%`;
    volumeDisplay.innerText = Math.round(percentage); // Update the displayed volume number
  }

  // Function to toggle volume control UI
  function toggleControlBox() {
    if (volumeControl.classList.contains("active")) {
      volumeControl.classList.remove("active");
      volumeSlider.removeEventListener("mousedown", controlVolume);
      return;
    }
    volumeControl.classList.add("active");
    volumeSlider.addEventListener("mousedown", controlVolume);

    // Update UI to reflect the current volume when opening
    updateVolumeUI(music.volume);
  }

  // Function to handle volume change from the UI
  function controlVolume(event) {
    if (!music) return;

    const rect = volumeSlider.getBoundingClientRect();
    let offsetY = event.clientY - rect.top;
    let percentage = 1 - Math.min(Math.max(offsetY / rect.height, 0), 1);

    music.volume = percentage;
    updateVolumeUI(percentage);
  }

  // Ensure volume UI updates when a song starts playing
  document.querySelectorAll(".music-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!music.paused) return;
      music.play();
      music.volume = initialVolume;
      updateVolumeUI(initialVolume);
    });
  });

  // Listen for volume change events (mute/unmute updates)
  music.addEventListener("volumechange", () => {
    updateVolumeUI(music.volume);
  });

  // Detect mute/unmute button press
  document.addEventListener("keydown", (event) => {
    const volumeIcon =
      document.querySelector(".fa-volume-high") ||
      document.querySelector(".fa-volume-mute");

    if (event.key === "AudioVolumeMute") {
      music.muted = !music.muted;

      if (music.muted) {
        volumeIcon.classList.remove("fa-volume-high");
        volumeIcon.classList.add("fa-volume-mute");
      } else {
        volumeIcon.classList.remove("fa-volume-mute");
        volumeIcon.classList.add("fa-volume-high");
      }

      updateVolumeUI(music.volume);
    } else if (event.key === "AudioVolumeUp") {
      music.volume = Math.min(music.volume + 0.1, 1);
      updateVolumeUI(music.volume);
    } else if (event.key === "AudioVolumeDown") {
      music.volume = Math.max(music.volume - 0.1, 0);
      updateVolumeUI(music.volume);
    }
  });
  volumeBtn.addEventListener("click", toggleControlBox);

  function openBarOptions() {
    let barOptionBox = document.querySelector(".bar-option-box");
    barOptionBox.classList.toggle("active");
  }

  // Event Listeners
  playBtn.addEventListener("click", togglePlay);
  music.addEventListener("timeupdate", updateProgressBar);
  progressBarOuter.addEventListener("click", setProgressBar);
  // Event listeners for next/prev buttons
  barSettingOption.addEventListener("click", openBarOptions);

  // chaning music on the
  music.addEventListener("ended", () => changeMusic(1));
  nextBtn.addEventListener("click", () => changeMusic(1));
  prevBtn.addEventListener("click", () => changeMusic(-1));

  // enabeling the setting options on the setting control button
  function showSettingOptions(element) {
    element.classList.toggle("active");
  }

  // Adding music to the playlist when user clicks on add to playlist button
  function openPlaylistModal(songDetails) {
    if (Object.keys(playlistCollection).length === 0) {
      alert("Please first create a playlist");
      return;
    }

    addSongToPlayList(songDetails);
    playlistModalEle.classList.add("active"); // This class will display our playlist modal
    closePlaylistModalBtn.addEventListener("click", closePlaylistModal);
  }

  // Adding song to the playlist
  function addSongToPlayList(song) {
    const selectBtnsCollection = playlistItem.querySelectorAll("button");
    selectBtnsCollection.forEach((btn) => {
      btn.replaceWith(btn.cloneNode(true)); // Remove old event listeners
    });

    // Re-select buttons after cloning to attach a fresh event listener
    const updatedBtnsCollection = playlistItem.querySelectorAll("button");
    updatedBtnsCollection.forEach((btn) => {
      btn.addEventListener("click", () => addSong(btn, song));
    });
  }
  // adding song when selecting paritcular one
  function addSong(button, song) {
    const selectedPlaylist = button.getAttribute("data-list").trim();
    playlistCollection[selectedPlaylist].songs.push(song);
    button.style.background = "hsl(139deg 100% 76.94%)";
    button.textContent = "Selected";
  };
  function resetBtnState() {
    const selectBtnsCollection = playlistItem.querySelectorAll("button");
    selectBtnsCollection.forEach((btn) => {
      btn.style.background = "#ffffff";
      btn.textContent = "Select";
    });
  };
  // closing the modal when cliked on close btn
  function closePlaylistModal() {
    playlistModalEle.classList.remove("active"); // this class will display our playlist modals
    resetBtnState();
  };

  // creating playlist on the click button
  createPlaylistEle.addEventListener("click", openModal);

  function openModal() {
    // adding modal element in the body
    document.querySelector("body").insertAdjacentHTML(
      "afterbegin",
      `<div id="playlist-modal" class="modal">
      <div class="modal-content">
        <span id="close-modal">&times;</span>
        <h2 class="text-primary">Create Playlist</h2>
        <input
          type="text"
          id="playlist-name"
          placeholder="Enter playlist name"
        />
        <button id="create-playlist-btn">Done</button>
      </div>
    </div>`
    );

    document
      .getElementById("close-modal")
      .addEventListener("click", closeModal);

    // closing the modal clicking on the button
    function closeModal() {
      document.getElementById("playlist-modal").remove();
    }

    const createPlayListBtn = document.getElementById("create-playlist-btn");
    const playListNameInput = document.getElementById("playlist-name");
    createPlayListBtn.addEventListener("click", addPlayList);

    function addPlayList() {
      const playListName = playListNameInput.value.trim();
      if (playListName == "") {
        alert("Please Enter Playlist Name");
      } else {
        let imageUrl = randomImages();
        playlistCollection[playListName] = { songs: [], cover: imageUrl }; // Add new playlist
        alert("Playlist has been Created");
      }
      loadPlayList();
      closeModal();
    }
  };

  function AllPlaylistModal() {
    playlistItem.textContent = "";
    Object.keys(playlistCollection).forEach((key) => {
      const listEle = document.createElement("div");
      listEle.classList.add("list");

      const listContentEle = document.createElement("div");
      listContentEle.classList.add("list-content");
      listEle.appendChild(listContentEle);

      const playlist_infoEle = document.createElement("div");
      playlist_infoEle.classList.add("playlist_info");
      listContentEle.appendChild(playlist_infoEle);

      const playListTitle = document.createElement("p");
      playListTitle.textContent = key;
      playListTitle.classList.add("text-primary");
      playListTitle.setAttribute("id", "title");
      playlist_infoEle.appendChild(playListTitle);

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "select";
      saveBtn.classList.add("save_btn");
      listContentEle.appendChild(saveBtn);

      // setting data to the button to match with key when adding to the playlist
      saveBtn.setAttribute("data-list", key);

      playlistItem.insertAdjacentElement("afterbegin", listEle);
    });
  };

  // generating rantom images
  function randomImages() {
    if (allSongs.length === 0) return; // Ensure there are images
    const randomIndex = Math.floor(Math.random() * allSongs.length); // Get a random index
    const randomImageUrl = allSongs[randomIndex].imgurl; // Pick the image UR
    return randomImageUrl;
  };

  // laoding playlist after creating playlist
  function loadPlayList() {
    playListEle.textContent = "";
    Object.keys(playlistCollection).forEach((key) => {
      const playlist = document.createElement("div");
      playlist.classList.add("playlist-item");

      const playlistCover = document.createElement("img");
      playlistCover.classList.add("cover-img");
      playlistCover.src = `${playlistCollection[key].cover}`;

      const playlistBtn = document.createElement("button");
      playlistBtn.classList.add("user-genre", "text-primary");
      playlistBtn.textContent = `${key}`;

      playlist.appendChild(playlistCover);
      playlist.appendChild(playlistBtn);

      // clicking on playlist element show all available songs
      playlist.addEventListener("click", () => showaddedSongs(key));
      playListEle.insertAdjacentElement("afterbegin", playlist); // inserting the created playlist in the playlist element
    });
    AllPlaylistModal();
  };

  function showaddedSongs(playlistName) {
    let allsongsDetails = playlistCollection[playlistName].songs;

    const modal = document.createElement("div");
    modal.classList.add("showsongsmodal");
    modal.style.display = "flex";
    modal.id = "songModal";

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeBtn = document.createElement("span");
    closeBtn.classList.add("close");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });

    const title = document.createElement("h2");
    title.textContent = "Song List";
    title.classList.add("text-primary");

    const songList = document.createElement("ul");
    songList.classList.add("song-list");

    for (let i = 0; i < allsongsDetails.length; i++) {
      const songItem = document.createElement("li");
      songItem.classList.add("song-item");

      const srNo = document.createElement("span");
      srNo.textContent = `${i + 1}.`;

      const songName = document.createElement("span");
      songName.classList.add("songName");
      songName.textContent = allsongsDetails[i].name;

      const playButton = document.createElement("button");
      playButton.classList.add("play-button");
      playButton.textContent = "▶";

      // appending all created element for list of songs
      songItem.appendChild(srNo);
      songItem.appendChild(songName);
      songItem.appendChild(playButton);
      songList.appendChild(songItem);
      songItem.addEventListener("click", () =>
        playFromPlaylist(allsongsDetails, allsongsDetails[i], i)
      );
    }

    // appending all elements created for modal of playlist of added songs
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(songList);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  };
  function playFromPlaylist(allsongs, song, index) {
    playlistRenderedsongs = allsongs;
    playlistSongsFlag = true;
    loadMusic(song, index);
  };

  // toggle button for user profile box
  toggleBtnEle.addEventListener("click", checkUserProfile);

  // checking user profile
  function checkUserProfile() {
    document.querySelector(".user-profile").classList.toggle("show");
  };

  // switching the theme on clicks
  themeBtnEle.addEventListener("click", switchTheme);
  function switchTheme() {
    themeBtnEle.classList.toggle("active");
    const bodyEle = document.querySelector("body");
    bodyEle.classList.toggle("light");

    let cards = document.querySelectorAll(".card");
    cards.forEach((element) => {
      element.classList.toggle("light", bodyEle.classList.contains("light"));
    });
  };
};

// starting when the Dom is loaded
document.addEventListener("DOMContentLoaded", initiateApp);
