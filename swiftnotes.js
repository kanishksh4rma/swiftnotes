const plusBtn = document.getElementById("plus-btn"),
    addBox = document.querySelector(".add-box"),
    // visibilityMsg = document.querySelector(".visibilityMsg"),
    popupBg = document.querySelector(".popup-bg"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBg.querySelector("header p"),
    closeIcon = popupBg.querySelector("header i"),
    pinpadForm = document.getElementById("pinpad"),
    notepadForm = document.getElementById("notepad"),
    titleTag = popupBg.querySelector("input"),
    descTag = popupBg.querySelector("textarea"),
    addBtn = popupBg.querySelector("button"),
    firstLi = document.querySelector(".tab-list li:first-child"),
    navigation = document.querySelector(".navigation");
    
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    let isUpdate = false, updateId;
    
    
    // Capitalize only first letter of note
    // function capitalizeFirstLetter(input) {
        //     input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1).toLowerCase();
        // }
        
        // OPEN POPUP BOX
        plusBtn.addEventListener("click", () => {
            popupTitle.innerText = "Add a new Note";
            addBtn.innerText = "Add Note";
            popupBg.classList.add("show");
            plusBtn.style.display = 'none';
            notepadForm.removeAttribute('hidden');
            pinpadForm.setAttribute('hidden', 'true');
            document.querySelector("body").style.overflow = "hidden";
            if (window.innerWidth > 660) descTag.focus();
        });

        document.addEventListener('keydown', function(event){
            const popupBgShown = popupBg.classList.contains('show');
            // New Note Shortcut
            if(event.altKey && event.key === 'n' && !popupBgShown){
                closeIcon.click();
                plusBtn.click();
            }
            // Save Note Shortcut
            if(event.altKey && event.key === 's' && popupBgShown){
                addBtn.click();
                console.log("popupbg lgao");
            }
            // CloseIcon Shortcut
            if(event.altKey && event.key === 'x' && popupBgShown){
                closeIcon.click();
            }
            // Search focus Shortcut
            if(event.altKey && event.key === 's' && !popupBgShown){
                search.focus();
            }
            // Archive Tab Shortcut
            if(event.altKey && event.key === 'a' && !popupBgShown){
                archiveTab.click();
            }
            // ThemeChange using searchbar Shortcut
            if(event.altKey && event.key === 'Enter'){
                let searchTerm = search.value.toLowerCase();
                switch (searchTerm) {
                    case 'red':
                        changeTheme('redrose');
                        break;
                    case 'yellow':
                        changeTheme('bananafish');
                        break;
                    case 'blue':
                        changeTheme('oceanblue');
                        break;
                    case 'pink':
                        changeTheme('pinkpanther');
                        break;
                    case 'purple':
                        changeTheme('purplemoon');
                        break;
                    case 'summer':
                    case 'orange':
                        changeTheme('summervacation');
                        break;
                    case 'dark':
                    case 'black':
                        changeTheme('darkmode');
                        break;
                    case 'light':
                    case 'white':
                        changeTheme('lightmode');
                        break;
                    case 'themes':
                    case 'theme':
                        showPallet();
                        break;
                    default:
                        search.focus();
                        break;
                }
            }
        });
        altEnterBtn.addEventListener('click', function(){
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                altKey: true
            });
            document.dispatchEvent(event);
        });
        
        // PinPad Pincode Submit Enter Shortcut
        pinpadForm.addEventListener('keydown', function(event){
            if(event.key === 'Enter'){
                event.preventDefault();
                pinSubmitBtn.click();
            }
        });

        // CLOSE POPUP BOX
        document.addEventListener('DOMContentLoaded', function () {
            
            closeIcon.addEventListener('click', closePopup);
            document.body.addEventListener('click', function (event) {
                if (popupBg.classList.contains('show') && !popupBox.contains(event.target) && !plusBtn.contains(event.target)) {
                    addBtn.click();     //this already contains closePopup();
                }
            });
        });
        function closePopup() {
            isUpdate = false;
            titleTag.value = descTag.value = "";
            popupBg.classList.remove("show");
            plusBtn.style.display = 'block';
            document.querySelector("body").style.overflow = "auto";
            gotoCurrentTab();
        }
        
        // Note (html)
        function showNotes() {
            if (!notes) return;
            document.querySelectorAll(".note").forEach(li => li.remove());
            notes.forEach((note, id) => {
                let filterDesc = note.description.replaceAll("\n", '<br/>');
                let liTag = `<li id="note-${id}" class="note ${note.pinned ? 'pinned' : ''}">
                <i class="bi-pin pin-icon"></i>
                <div class="details">
                <p>${note.title}</p>
                <span>${filterDesc}</span>
                </div>
                <div class="bottom-content">
                <span>${note.date}</span>
                <i class="fa-regular fa-star star-icon"></i>
                <div class="settings">
                <i onclick="openNoteMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="menu">
                <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                <li onclick="archiveNote(${id})" class="archive-btn"><i class="uil uil-archive"></i>Archive</li>
                <li onclick="deleteNote(${id})" id="delete"><i class="uil uil-trash"></i>Delete</li>
                </ul>
                </div>
                </div>
                </li>`;
                addBox.insertAdjacentHTML("afterend", liTag);
            });
        }
        showNotes();
        
        // Archiving Note...
        function archiveNote(noteId) {
            const note = document.getElementById(`note-${noteId}`);
            note.classList.toggle('archived');
            note.classList.remove('pinned', 'starred');
            const archiveOption = note.classList.contains('archived') ? "Unarchive" : "Archive";
    const archiveButton = note.querySelector('.archive-btn');
    if (archiveButton) {
        archiveButton.innerHTML = `<i class="uil uil-archive"></i>${archiveOption}`;
    }
    const allTabClickedState = document.querySelector('.allnotes-tab .clickedState');
    if (allTabClickedState) {
        archiveTab.click();
        allNotesTab.click();
    }
    const noteArchives = document.querySelectorAll('.note .archived');
    const emptyArchive = noteArchives.length === 0;
    if (emptyArchive) {
        allNotesTab.click();
    } else {
        const allArchived = Array.from(noteArchives).every(note => note.classList.contains('archived'));
        if (allArchived) {
            archiveTab.click();
        } else {
            allNotesTab.click();
        }
    }
    visibilityMsgShown();
    storeNoteStatus();
}

function openNoteMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}


let deleteAfterUnpin = (noteId) => {
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    location.reload();
};
function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note? ");
    // let confirmDel = confirm("This note will be deleted. \n Any previously marked notes will be unmarked, and the note before that one will be marked.");
    if (!confirmDel) return;

    resetNoteStatus(noteId);
}

function resetNoteStatus(noteId) {
    const note = document.getElementById(`note-${noteId}`);
    const isPinned = note.classList.contains('pinned');
    const isStarred = note.classList.contains('starred');

    if (isPinned) {
        const pinIcon = document.querySelector(`#note-${noteId} .pin-icon`);
        pinIcon.click()
        deleteAfterUnpin(noteId);
    }
    else {
        deleteAfterUnpin(noteId);
    }
    if (isStarred) {
        const starIcon = document.querySelector(`#note-${noteId} .star-icon`);
        starIcon.click();
        deleteAfterUnpin(noteId);
    }
    visibilityMsgShown();
}


// DO NOT CHANGE THE LINE POSITIONS
function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    // Delay in open-popupBox
    setTimeout(() => {
        plusBtn.click();
        popupTitle.innerHTML = "Update a Note";
        addBtn.innerHTML = "Update Note";
        titleTag.value = title;
        descTag.value = description;
    }, 100);
    // location.reload();
}


//Add Note btn
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if (title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        let noteInfo = { title, description, date: `${month} ${day}, ${year}` };

        if (!isUpdate) {
            // Add new note
            notes.push(noteInfo);
        } else {
            // Update existing note
            notes[updateId] = noteInfo;
            isUpdate = false; // Reset update flag after updating
        }

        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closePopup(); // Close the popup after adding/updating note
        location.reload();
    }
});


// PROFILE ACCOUNT POPUP
const profile = document.getElementById('profile');
const profileMenu = document.getElementById('profile-menu');

function showProfileMenu() {
    profile.classList.toggle('show');
    profile.querySelector('i').classList.toggle('fa-angle-up');
    document.addEventListener('click', closeProfileMenu);
}

function closeProfileMenu(event) {
    if (!profileMenu.contains(event.target) && !profile.contains(event.target)) {
        profile.querySelector('i').classList.remove('fa-angle-up');
        profile.classList.remove('show');
        document.removeEventListener('click', closeProfileMenu);
    }
}

// ClickedState - Top Tabs
const topTabs = document.querySelectorAll('.toptab');
topTabs.forEach(function (topTab) {
    topTab.addEventListener('click', addBottomBorder);
});
function addBottomBorder(event) {
    topTabs.forEach(function (topTab) {
        topTab.classList.remove('clickedState');
        removeLeftBorder();
    });
    event.target.classList.add('clickedState');
}

function removeBottomBorder() {
    topTabs.forEach(function (topTab) {
        topTab.classList.remove('clickedState');
    });
}

// sidetabClickedState - SideTabs
const sidetabs = document.querySelectorAll('.sidetab');
sidetabs.forEach(function (sidetab) {
    sidetab.addEventListener('click', addLeftBorder);
});
function addLeftBorder(event) {
    sidetabs.forEach(function (sidetab) {
        sidetab.classList.remove('sidetabClickedState');
        removeBottomBorder();
    });
    if (event.currentTarget.classList.contains('sidetab') || sidebar.classList.contains('active')) {
        event.currentTarget.classList.add('sidetabClickedState');
    }
}

function removeLeftBorder() {
    sidetabs.forEach(function (sidetab) {
        sidetab.classList.remove('sidetabClickedState');
    });
}

// All Notes Tab
const allNotesTab = document.getElementById('allnotes-tab');
function goToAllNotesTab() {
    noteCards.forEach(function (note) {
        note.style.display = 'block';

        // remove archived note
        const archived = note.classList.contains('archived');
        if (archived) {
            note.style.display = 'none';
        } else {
            note.style.display = 'block';
        }
    });
}

// Pinned Tab
const pinTab = document.getElementById('pin-tab');
pinTab.addEventListener('click', function () {
    noteCards.forEach(function (note) {
        const pinned = note.classList.contains('pinned');
        if (pinned) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
            visibilityMsg.innerText = '';
            visibilityMsg.innerText = '"Pinned" notes will appear here';
        }
    });
});
// pinning note
const pins = document.querySelectorAll(".pin-icon");
pins.forEach(function (pin) {
    pin.addEventListener('click', function () {
        pin.closest('.note').classList.toggle('pinned');
        pin.classList.toggle('material-icons');
        if (pin.classList.contains('material-icons')) {
            pin.innerHTML = 'push_pin';
            pin.classList.toggle('bi-pin');
        } else {
            pin.innerHTML = '';
            pin.classList.toggle('bi-pin');
        }
        storeNoteStatus();
    });
});

// Favorites Tab
const favTab = document.getElementById('fav-tab');
favTab.addEventListener('click', function () {
    noteCards.forEach(function (note) {
        const starred = note.classList.contains('starred');
        if (starred) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
            visibilityMsg.innerText = '';
            visibilityMsg.innerText = '"Favorite" notes will appear here';
        }
    });
});
// fav notes
const stars = document.querySelectorAll(".star-icon");
stars.forEach(function (star) {
    star.addEventListener('click', function () {
        const note = star.closest('.note');
        note.classList.toggle('starred');
        star.classList.toggle('fa-solid');

        if (note.classList.contains('starred')) {
            star.classList.add('yellow-star');
        } else {
            star.classList.remove('yellow-star');
        }
        storeNoteStatus();
    });
});

// Important Tab
const impTab = document.getElementById('imp-tab');
impTab.addEventListener('click', function () {
    noteCards.forEach(function (note) {
        note.style.display = 'none';
        visibilityMsgShown();
        visibilityMsg.innerText = '';
    visibilityMsg.innerHTML = 'Alt + N == Add new note<br>Alt + S == Save/Update note<br>Alt + X == Cancel the note<br>Alt + S == Search a note<br>Alt + Enter == Change Theme (using search bar)'
        // visibilityMsg.innerText = '"Important" notes will appear here';
        
    });
});
// Task Tab
const taskTab = document.getElementById('task-tab');
taskTab.addEventListener('click', function () {
    noteCards.forEach(function (note) {
        note.style.display = 'none';
        visibilityMsgShown();
    visibilityMsg.innerHTML = 'Alt + N == Add new note<br>Alt + S == Save/Update note<br>Alt + X == Cancel the note<br>Alt + S == Search a note<br>Alt + Enter == Change Theme (using search bar)'
    });
});

// Contact-Us Tab
const contactTab = document.getElementById('contact-tab');
const socialNotes = document.querySelectorAll('.social-note');
const regularNotes = document.querySelectorAll('.regular-note');
const notSocialNotes = document.querySelectorAll('.note:not(.social-note)');
contactTab.addEventListener('click', function () {
    notSocialNotes.forEach(function (notSocialNote) {
        notSocialNote.style.display = 'none';
    });
    socialNotes.forEach(function (socialNote) {
        socialNote.style.display = 'block';
    });
});

const otherTabs = document.querySelectorAll('.tab:not(#contact-tab)');
otherTabs.forEach(function (otherTab) {
    otherTab.addEventListener('click', function () {
        // Hide social notes
        socialNotes.forEach(function (socialNote) {
            socialNote.style.display = 'none';
        });
    });
});


// Function to store pinned notes in local storage
function storeNoteStatus() {
    const pinnedNotes = document.querySelectorAll('.note.pinned');
    const starredNotes = document.querySelectorAll('.note.starred');
    const archivedNotes = document.querySelectorAll('.note.archived');

    const pinnedNoteIds = Array.from(pinnedNotes).map(note => note.id);
    const starredNoteIds = Array.from(starredNotes).map(note => note.id);
    const archivedNoteIds = Array.from(archivedNotes).map(note => note.id);

    localStorage.setItem('pinnedNotes', JSON.stringify(pinnedNoteIds));
    localStorage.setItem('starredNotes', JSON.stringify(starredNoteIds));
    localStorage.setItem('archivedNotes', JSON.stringify(archivedNoteIds));
}

// Function to load pinned notes from local storage
function loadNoteStatus(noteType, className, iconClass) {
    const noteIds = JSON.parse(localStorage.getItem(`${noteType}Notes`)) || [];
    noteIds.forEach(noteId => {
        const note = document.getElementById(noteId);
        if (note) {
            note.classList.add(className);
            if (iconClass) {
                const icon = note.querySelector(`.${iconClass}`);
                if (icon) {
                    // Adjust icon appearance based on note type
                    if (noteType === 'pinned') {
                        icon.innerHTML = 'push_pin';
                        icon.classList.add('material-icons');
                        icon.classList.remove('bi-pin');
                    } else if (noteType === 'starred') {
                        icon.classList.add('yellow-star');
                        icon.classList.add('fa-solid');
                    } else if (noteType === 'archived') {
                        // Check if note is archived, if not, update the menu icon
                        const archiveOption = note.classList.contains('archived') ? "Unarchive" : "Archive";
                        const archiveButton = note.querySelector('.archive-btn');
                        if (archiveButton) {
                            archiveButton.innerHTML = `<i class="uil uil-archive"></i>${archiveOption}`;
                        }
                    }
                }
            }
        }
    });
}

// Archive Tab (with Pin verification)
const pinSubmitBtn = document.getElementById("pin-SubmitBtn");
const archiveTab = document.getElementById("archive-tab");
const pinInput = document.getElementById('pin-input');
const settings = document.getElementById('settings');
const lockIcon = document.getElementById('lockIcon');
const changePinBtn = document.querySelector('.change-pinBtn');

function lockIconChange(){
    if(settings.classList.contains('instantLock')){
        lockIcon.classList.add('fa-lock');
        lockIcon.classList.remove('fa-lock-open');
    } else{
        lockIcon.classList.remove('fa-lock');
        lockIcon.classList.add('fa-lock-open');
    }
}

settings.addEventListener('click', ()=> {
    const instantLock = settings.classList.toggle('instantLock');
    lockIconChange();
    localStorage.setItem('instantLock', instantLock);
    if(instantLock){
        // archiveTab.classList.remove('unlocked');
        location.reload();
    }
});


archiveTab.addEventListener("click", () => {
    const locked = !archiveTab.classList.contains('unlocked');
    if(locked){
        popupTitle.innerText = "Enter Archive Pincode";
        addBtn.innerText = "Access Archive";
        popupBg.classList.add("show");
        plusBtn.style.display = 'none';
        changePinBtn.style.display = 'none';
        pinInput.value = '';
        pinpadForm.removeAttribute('hidden');
        notepadForm.setAttribute('hidden', 'true');
        document.querySelector("body").style.overflow = "hidden";
        if (window.innerWidth > 660) pinInput.focus();
    }
    else{
        showArchivedNotes();
        }
    });
    
    
    pinSubmitBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const enteredPin = pinInput.value;
        const correctPin = localStorage.getItem('correctPin');
        if (enteredPin === correctPin) {
            pinInput.value = "";
            popupBg.classList.remove("show");
            archiveTab.classList.add('unlocked');
            showArchivedNotes();
            localStorage.setItem('currentTab', 'archive-tab');
        } else {
            alert("Incorrect PIN code. Please try again.");
            pinInput.value = "";
            pinInput.focus();
        }
        visibilityMsgShown();
    });
    
function showArchivedNotes() {
    changePinBtn.style.display = 'block';
    noteCards.forEach(function (note) {
        const archived = note.classList.contains("archived");
        if (archived) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
            visibilityMsg.innerText = "";
            visibilityMsg.innerText = '"Archived" notes will appear here';
        }
        removeBottomBorder();
    });
};
// Lock ArchiveTab again!!
const tabs = document.querySelectorAll('.tab');
tabs.forEach(function(tab){
    tab.addEventListener('click', ()=>{
        currentTab = event.currentTarget.id;
        if(currentTab !== 'archive-tab'){
            localStorage.setItem('currentTab', currentTab);
            changePinBtn.style.display = 'none';
            if(settings.classList.contains('instantLock')){
                archiveTab.classList.remove('unlocked');
            }
        }
        visibilityMsgShown();

    });
});

let visibilityMsg = document.querySelector('.visibilityMsg');
function visibilityMsgShown(){
    let visibleNotes = false;
        noteCards.forEach(function (note){
            if(note.style.display === 'block'){
                visibleNotes = true;
            }
        });
        visibilityMsg.style.display = visibleNotes ? 'none' : 'block';
}

let correctPin = localStorage.getItem('correctPin');
if (!correctPin) {
    correctPin = "1234"; // Set default PIN
    localStorage.setItem('correctPin', correctPin);
}
changePinBtn.addEventListener('click', () => {
    const enteredPin = prompt("Enter new PIN code:");
    if (enteredPin) {
        localStorage.setItem('correctPin', enteredPin);
        alert("PIN code changed successfully!");
        lockIcon.classList.toggle('fa-lock');
        location.reload();
    }
});


// Retain Previous Tab
function gotoCurrentTab(){
    closeIcon.click();
    const currentTab = localStorage.getItem('currentTab');
    const currentTabElement = document.getElementById(currentTab);
    if(currentTab !== 'archive-tab'){
        if(currentTabElement){
            currentTabElement.click();
        }
    } else{
        allNotesTab.click();
    }
}



// SEARCH NOTES
let search = document.getElementById("searchBar");
let noteCards = document.querySelectorAll('.note');

search.addEventListener('input', function () {
    let searchTerm = search.value.toLowerCase();
    noteCards.forEach(function (note) {
        let title = note.querySelector("p").innerText.toLowerCase();
        let description = note.querySelector("span").innerText.toLowerCase();
        let noteText = title + " " + description;

        if(!archiveTab.classList.contains('sidetabClickedState')){
            if (noteText.includes(searchTerm) && !note.classList.contains('archived')) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
                visibilityMsgShown();
                visibilityMsg.innerText = '';
                visibilityMsg.innerText = '"Searched" note not found! 🔍';
            }
        } else{
            if (noteText.includes(searchTerm)) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
                visibilityMsgShown();
            }
        }
        if(!searchTerm){
            // closeIcon.click();
            visibilityMsgShown();
            const currentTab = localStorage.getItem('currentTab');
            const currentTabElement = document.getElementById(currentTab);
            if(currentTabElement){
                currentTabElement.click();
                    if(archiveTab.classList.contains('unlocked')){
                        showArchivedNotes();
                    }
                }
            }
        });
        switch(searchTerm){
        case 'red':
        case 'yellow':
        case 'purple':
        case 'pink':
        case 'blue':
        case 'orange':
        case 'summer':
        case 'dark':
        case 'black':
        case 'light':
        case 'white':
        case 'theme':
        case 'themes':
            altEnterBtn.style.display = 'block';
            break;
        default:
            altEnterBtn.style.display = 'none';
            break;
    }
});

// EXPANDABLE SIDEBAR
const sidebar = document.querySelector('.sidebar');
const menubar = sidebar.querySelector('.menubar');

function expandSideBar() {
    sidebar.classList.toggle('active');
    document.addEventListener('click', unexpandSideBar);
}
function unexpandSideBar(event) {
    if (!menubar.contains(event.target) && !sidebar.contains(event.target) && !navigation.contains(event.target)) {
        sidebar.classList.remove('active');
        document.removeEventListener('click', unexpandSideBar);
    }
}


// COLOR PALLET:
const colorPallet = document.querySelector('.color-pallet');
const colors = document.querySelectorAll('.color');
const colorSchemeBtn = document.getElementById('color-scheme');
const noteDates = document.querySelectorAll('.bottom-content span');
const settingsIcons = document.querySelectorAll('.bottom-content .settings i');
const body = document.body;

//Theme pallet - open/close
function showPallet() {
    if (!colorPallet.classList.contains('active')) {
        colorPallet.classList.add('active');
        document.addEventListener('click', closePallet);
    } else {
        colorPallet.classList.remove('active');
    }
}
function closePallet() {
    if (!colorPallet.contains(event.target) && !colorSchemeBtn.contains(event.target)) {
        colorPallet.classList.remove('active');
        document.removeEventListener('click', closePallet);
    }
}
//Theme Pallet List - passing theme name for changeTheme
colors.forEach(color => {
    color.addEventListener('click', function () {
        themeName = color.textContent.replace(/\s/g, '');
        changeTheme(themeName);
    });
});
// Change Theme Function
function changeTheme(currentTheme) {
    body.className = ''; // Remove existing classes
    body.classList.add(currentTheme); // Add the selected theme class
    themeText.innerText = currentTheme === 'darkmode' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    noteDates.forEach(function (noteDate) {
        noteDate.style.color = currentTheme === 'lightmode' || currentTheme === 'darkmode' ? '#6d6d6d' : 'var(--note-fonts)';
    });
    settingsIcons.forEach(function (settingsIcon) {
        settingsIcon.style.color = currentTheme === 'lightmode' || currentTheme === 'darkmode' ? '#6d6d6d' : 'var(--note-fonts)';
    });
}
// On Reload get Theme
document.addEventListener('DOMContentLoaded', function () {
    firstLi.classList.add('clickedState'); // All notes tab already underlined
    let currentTheme = localStorage.getItem('theme');
    changeTheme(currentTheme);
    loadNoteStatus('pinned', 'pinned', 'pin-icon');
    loadNoteStatus('starred', 'starred', 'star-icon');
    loadNoteStatus('archived', 'archived', null);
    
    closeIcon.click();
    const currentTab = localStorage.getItem('currentTab');
    const currentTabElement = document.getElementById(currentTab);
    if(currentTab !== 'archive-tab'){
        if(currentTabElement){
            currentTabElement.click();
        }
    } else{
        allNotesTab.click();
    }
    const instantLock = localStorage.getItem('instantLock') === "true";
    settings.classList.toggle('instantLock', instantLock);
    lockIconChange();
});

// Dark Mode
const themeText = document.getElementById('themeText');
function darkMode() {
    const currentTheme = !body.classList.contains('darkmode') ? 'darkmode' : 'lightmode';
    changeTheme(currentTheme);
    themeText.innerText = currentTheme === 'darkmode' ? 'Light' : 'Dark';
}


// function adjustNoteSize() {
//     var notes = document.querySelectorAll('.wrapper li');
//     notes.forEach(function(note) {
//       var contentHeight = note.scrollHeight;
//       // Set the maximum height based on content
//       var maxHeight = contentHeight > 330 ? 330 : 250;
//       note.style.maxHeight = maxHeight + 'px';
//     });
//   }
  
//   document.addEventListener('DOMContentLoaded', adjustNoteSize);
//   inputField.addEventListener('input', adjustNoteSize);
   