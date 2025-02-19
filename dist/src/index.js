"use strict"; // TypeScript'in katı modunu etkinleştirir, hataları yakalamaya yardımcı olur.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// API URL'si, JSON Server ile çalışan görev listesi için kullanılır
const apiUrl = "http://localhost:3000/todos";
// DOM Elemanlarını Seçme ve Tür Tanımlama
const todoList = document.getElementById("todo-list");
const todoInput = document.getElementById("todo-text");
const addBtn = document.getElementById("add-btn");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");
const categorySelect = document.getElementById("category-select");
const filterSelect = document.getElementById("filter-select");
const taskStatus = document.getElementById("task-status");
const removeCheckedBtn = document.getElementById("remove-checked");
// Sayfa yüklendiğinde görevleri getir
document.addEventListener("DOMContentLoaded", () => {
    fetchTodos();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Görevleri Getir ve Listeye Ekle
function fetchTodos() {
    return __awaiter(this, arguments, void 0, function* (filter = "all") {
        if (!todoList || !taskStatus)
            return; // Eğer HTML elemanları yoksa işlemi iptal et.
        const response = yield fetch(apiUrl); // JSON Server'dan görevleri al
        let todos = yield response.json();
        // Eğer belirli bir filtre uygulanmışsa, görevleri filtrele
        if (filter !== "all") {
            todos = todos.filter(todo => todo.category === filter);
        }
        todoList.innerHTML = ""; // Mevcut görev listesini temizle
        let completedCount = 0; // Tamamlanan görev sayısını tutar
        todos.forEach(todo => {
            if (todo.completed)
                completedCount++; // Tamamlananları say
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
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Yeni görev ekleme
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    if (!todoInput || !prioritySelect || !dueDateInput || !categorySelect)
        return; // Null kontrolü yap
    const text = todoInput.value.trim(); // Kullanıcının girdiği metni al
    const priority = prioritySelect.value; // Seçilen önceliği al
    const dueDate = dueDateInput.value; // Seçilen tarihi al
    const category = categorySelect.value; // Seçilen kategoriyi al
    if (!text)
        return; // Eğer görev metni boşsa işlemi iptal et
    yield fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, completed: false, priority, dueDate, category }) // Yeni görevi API'ye ekle
    });
    fetchTodos(); // Listeyi güncelle
    todoInput.value = ""; // Input alanını temizle
}));
// Tamamlanan görevleri silme
removeCheckedBtn === null || removeCheckedBtn === void 0 ? void 0 : removeCheckedBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(apiUrl);
    const todos = yield response.json();
    for (const todo of todos) {
        if (todo.completed) {
            yield fetch(`${apiUrl}/${todo.id}`, { method: "DELETE" }); // Tamamlananları API'den sil
        }
    }
    fetchTodos(); // Listeyi güncelle
}));
// Görev Güncelleme veya Silme İşlemi
todoList === null || todoList === void 0 ? void 0 : todoList.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const target = event.target;
    const listItem = target.closest(".todo-item");
    const id = listItem === null || listItem === void 0 ? void 0 : listItem.dataset.id; // Görevin ID'sini al
    if (!id)
        return;
    // Düzenleme butonuna tıklanırsa
    if (target.classList.contains("edit-btn")) {
        const newText = prompt("Yeni görev girin:", ((_a = listItem.querySelector(".todo-text")) === null || _a === void 0 ? void 0 : _a.textContent) || "");
        if (!newText)
            return;
        yield fetch(`${apiUrl}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newText }) // Görev metnini güncelle
        });
        fetchTodos(); // Listeyi güncelle
    }
    // Silme butonuna tıklanırsa
    if (target.classList.contains("delete-btn")) {
        if (confirm("Silmek istiyor musunuz?")) {
            yield fetch(`${apiUrl}/${id}`, { method: "DELETE" }); // Görevi API'den sil
            fetchTodos(); // Listeyi güncelle
        }
    }
}));
// Görev Tamamlama Durumunu Güncelleme
todoList === null || todoList === void 0 ? void 0 : todoList.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    const listItem = target.closest(".todo-item");
    const id = listItem === null || listItem === void 0 ? void 0 : listItem.dataset.id;
    if (!id)
        return;
    yield fetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: target.checked }) // Görevin tamamlanma durumunu güncelle
    });
    fetchTodos(); // Listeyi güncelle
}));
// Filtreleme işlemi (Kategoriye göre görevleri listeleme)
filterSelect === null || filterSelect === void 0 ? void 0 : filterSelect.addEventListener("change", () => {
    fetchTodos(filterSelect.value);
});
// Tarih Formatını Düzenleme (YYYY-AA-GG formatını daha okunaklı hale getirir)
function formatDate(dateString) {
    if (!dateString)
        return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR");
}
