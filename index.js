let searchNote = document.getElementById("filter");
let totalNote = document.querySelector(".totalNote");
let showing = document.querySelector(".showing");
let noteTitle = document.getElementById("noteTitle");
let noteDesc = document.getElementById("note-desc");
let listItem = document.getElementById("listIt");
let submitBtn = document.getElementById("finalSubmit");

const API_URL = "https://crudcrud.com/api/045745fcfcba4e1cadde16a9e9d2bf0f/notes";
let notesData = []; // Store fetched notes globally

document.addEventListener("DOMContentLoaded", () => {
  
  function renderNotes(notes) {
    listItem.innerHTML = ""; 

    notes.forEach((note) => {
      let newLiElement = document.createElement("li");
      newLiElement.innerHTML = `
        <h3>${note.noteTitleText}</h3>
        <p>${note.noteDescText}</p>
        <button class="delete-btn" data-id="${note._id}">Delete</button>
      `;
      listItem.appendChild(newLiElement);
    });

    totalNote.textContent = notesData.length; 
    showing.textContent = notes.length; 

 
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", (event) => {
        let noteId = event.target.dataset.id;
        deleteNote(noteId);
      });
    });
  }

  function getAll() {
    axios.get(API_URL)
      .then((result) => {
        notesData = result.data; 
        renderNotes(notesData);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }

  function deleteNote(noteId) {
    axios.delete(`${API_URL}/${noteId}`)
      .then(() => {
        notesData = notesData.filter(note => note._id !== noteId); 
        renderNotes(notesData);
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  }

  submitBtn.addEventListener("click", () => {
    let noteTitleText = noteTitle.value.trim();
    let noteDescText = noteDesc.value.trim();

    if (noteTitleText === "" || noteDescText === "") return;

    let newNotes = {
      noteTitleText, 
      noteDescText,  
      createdAt: new Date().toISOString(),
    };

    axios.post(API_URL, newNotes)
      .then((response) => {
        notesData.push(response.data); 
        renderNotes(notesData);
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });

    noteTitle.value = "";
    noteDesc.value = "";
  });

  searchNote.addEventListener("input", () => {
    let query = searchNote.value.trim().toLowerCase();
    
    let filteredNotes = notesData.filter(note =>
      note.noteTitleText.toLowerCase().includes(query) || 
      note.noteDescText.toLowerCase().includes(query)
    );

    renderNotes(filteredNotes);
  });

  getAll(); 
});
