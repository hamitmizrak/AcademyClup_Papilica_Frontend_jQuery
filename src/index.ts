"use strict"; // TypeScript'in katı modunu etkinleştirir, hataları yakalamaya yardımcı olur.

// API URL'si, JSON Server ile çalışan görev listesi için kullanılır
const apiUrl = "http://localhost:3000/todos";

// DOM Elemanlarını Seçme ve Tür Tanımlama
const todoList = document.getElementById("todo-list") as HTMLUListElement | null;
const todoInput = document.getElementById("todo-text") as HTMLInputElement | null;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement | null;
const prioritySelect = document.getElementById("priority-select") as HTMLSelectElement | null;
const dueDateInput = document.getElementById("due-date") as HTMLInputElement | null;
const categorySelect = document.getElementById("category-select") as HTMLSelectElement | null;
const filterSelect = document.getElementById("filter-select") as HTMLSelectElement | null;
const taskStatus = document.getElementById("task-status") as HTMLSpanElement | null;
const removeCheckedBtn = document.getElementById("remove-checked") as HTMLButtonElement | null;


// Sayfa yüklendiğinde görevleri getir
document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
});


// `Todo` arayüzü oluşturma (görevlerin veri modelini tanımlar)
interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: string;
    dueDate: string;
    category: string;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Görevleri Getir ve Listeye Ekle
async function fetchTodos(filter: string = "all") {
    if (!todoList || !taskStatus) return; // Eğer HTML elemanları yoksa işlemi iptal et.

    const response = await fetch(apiUrl); // JSON Server'dan görevleri al
    let todos: Todo[] = await response.json();

    // Eğer belirli bir filtre uygulanmışsa, görevleri filtrele
    if (filter !== "all") {
        todos = todos.filter(todo => todo.category === filter);
    }

    todoList.innerHTML = ""; // Mevcut görev listesini temizle
    let completedCount = 0; // Tamamlanan görev sayısını tutar

    todos.forEach(todo => {
        if (todo.completed) completedCount++; // Tamamlananları say

        const listItem = document.createElement("li"); // Yeni görev öğesi oluştur
        listItem.classList.add("todo-item");
        listItem.dataset.id = todo.id;
        listItem.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${todo.completed ? "checked" : ""}>
            <span class="todo-text ${todo.completed ? "checked" : ""}">
                ${todo.text} - <strong>${todo.priority}</strong> (Son Tarih: ${formatDate(todo.dueDate)}) [${todo.category}]
            </span>
            <button class="edit-btn">✎</button>
            <button class="delete-btn">✖</button>
        `;
        todoList.appendChild(listItem); // Listeye ekle
    });

    // Tamamlanan görev sayısını güncelle
    taskStatus.innerHTML = `<span class="highlight">${completedCount}</span> tamamlandı`;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Yeni görev ekleme
addBtn?.addEventListener("click", async () => {
    if (!todoInput || !prioritySelect || !dueDateInput || !categorySelect) return; // Null kontrolü yap

    const text = todoInput.value.trim(); // Kullanıcının girdiği metni al
    const priority = prioritySelect.value; // Seçilen önceliği al
    const dueDate = dueDateInput.value; // Seçilen tarihi al
    const category = categorySelect.value; // Seçilen kategoriyi al

    if (!text) return; // Eğer görev metni boşsa işlemi iptal et

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, completed: false, priority, dueDate, category }) // Yeni görevi API'ye ekle
    });

    fetchTodos(); // Listeyi güncelle
    todoInput.value = ""; // Input alanını temizle
});

// Tamamlanan görevleri silme
removeCheckedBtn?.addEventListener("click", async () => {
    const response = await fetch(apiUrl);
    const todos: Todo[] = await response.json();

    for (const todo of todos) {
        if (todo.completed) {
            await fetch(`${apiUrl}/${todo.id}`, { method: "DELETE" }); // Tamamlananları API'den sil
        }
    }
    fetchTodos(); // Listeyi güncelle
});

// Görev Güncelleme veya Silme İşlemi
todoList?.addEventListener("click", async (event: Event) => {
    const target = event.target as HTMLElement;
    const listItem = target.closest(".todo-item") as HTMLLIElement | null;
    const id = listItem?.dataset.id; // Görevin ID'sini al

    if (!id) return;

    // Düzenleme butonuna tıklanırsa
    if (target.classList.contains("edit-btn")) {
        const newText = prompt("Yeni görev girin:", listItem.querySelector(".todo-text")?.textContent || "");
        if (!newText) return;

        await fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newText }) // Görev metnini güncelle
        });

        fetchTodos(); // Listeyi güncelle
    }

    // Silme butonuna tıklanırsa
    if (target.classList.contains("delete-btn")) {
        if (confirm("Silmek istiyor musunuz?")) {
            await fetch(`${apiUrl}/${id}`, { method: "DELETE" }); // Görevi API'den sil
            fetchTodos(); // Listeyi güncelle
        }
    }
});

// Görev Tamamlama Durumunu Güncelleme
todoList?.addEventListener("change", async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const listItem = target.closest(".todo-item") as HTMLLIElement | null;
    const id = listItem?.dataset.id;

    if (!id) return;

    await fetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: target.checked }) // Görevin tamamlanma durumunu güncelle
    });

    fetchTodos(); // Listeyi güncelle
});

// Filtreleme işlemi (Kategoriye göre görevleri listeleme)
filterSelect?.addEventListener("change", () => {
    fetchTodos(filterSelect.value);
});

// Tarih Formatını Düzenleme (YYYY-AA-GG formatını daha okunaklı hale getirir)
function formatDate(dateString: string | null): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR");
}
