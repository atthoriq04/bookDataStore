const list = [];
window.addEventListener("DOMContentLoaded", function () {
  loadFile();
});
const submit = document.getElementById("Submit");
let judul = document.getElementById("judul");
let penulis = document.getElementById("penulis");
let terbit = document.getElementById("tahun");
let bool = document.getElementById("selesai");
const search = document.getElementById("search");
//Proses Submit Data
submit.addEventListener("click", function (e) {
  if (validate() == true) {
    let judul = document.getElementById("judul").value;
    let penulis = document.getElementById("penulis").value;
    let terbit = document.getElementById("tahun").value;
    let bool = document.getElementById("selesai").checked;
    if (submit.innerHTML == "Edit") {
      let index = document.getElementById("ids").innerHTML;
      list[index].title = judul;
      list[index].author = penulis;
      list[index].year = terbit;
      list[index].isComplete = bool;
      save();
      resetInput();
    } else {
      const book = {
        id: Date.now(),
        title: judul,
        author: penulis,
        year: terbit,
        isComplete: bool,
      };
      list.push(book);
      save();
      resetInput();
    }
  }
  e.preventDefault();
});
//Proses Delete,Edit, Memindahkan antar Rak Buku
const container = document.querySelectorAll(".content");
for (i = 0; i < container.length; i++) {
  container[i].addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    //Mengambil Id dari Buku
    const elemId = e.target.parentElement.parentElement.firstChild.innerHTML;
    //Mencari Index Array berdasar Id yang didapat
    const index = list.findIndex((item) => item.id == elemId);
    //Menghapus Data
    if (e.target.className == "hapus") {
      let text = "Apakah Anda Yakin untuk menghapus data ini?";
      if (confirm(text) == true) {
        list.splice(index, 1);
        save();
      }
    }
    // Memindahkan antar Rak Buku
    if (e.target.className == "ubah") {
      let bool;
      if (list[index].isComplete == false) bool = true;
      if (list[index].isComplete == true) bool = false;
      list[index].isComplete = bool;
      save();
    }
    // Mengedit Buku
    if (e.target.className == "edit") {
      judul.value = list[index].title;
      penulis.value = list[index].author;
      terbit.value = list[index].year;
      bool.checked = list[index].isComplete;
      const p = document.createElement("p");
      const t = document.createTextNode(index);
      p.appendChild(t);
      p.setAttribute("id", "ids");
      p.style.display = "none";
      judul.parentElement.appendChild(p);
      submit.innerHTML = "Edit";
    }
  });
}
//Trigger Search
search.addEventListener("keyup", function () {
  value = search.value;
  if (value !== " ") {
    searching(value);
  } else {
    // resetHolder();
  }
});
search.addEventListener("focusout", function () {
  value = search.value;
  if (value == "") {
    const empty2 = document.getElementById("empty2");
    text = empty2.firstChild;
    text.nextSibling.innerHTML = "Data Kosonng...";
    text.nextSibling.nextElementSibling.innerHTML = "Silahkan Isi Data";
    const empty = document.getElementById("empty1");
    text = empty.firstChild;
    text.nextSibling.innerHTML = "Data Kosonng...";
    text.nextSibling.nextElementSibling.innerHTML = "Silahkan Isi Data";
  }
});

//Mereset Form
function resetInput() {
  let judul = document.getElementById("judul");
  let penulis = document.getElementById("penulis");
  let terbit = document.getElementById("tahun");
  let bool = document.getElementById("selesai");
  judul.value = "";
  penulis.value = "";
  terbit.value = "";
  bool.checked = false;
  submit.innerHTML = "Input";
}
//Validasi Form
function validate() {
  const vJudul = document.getElementById("validate-judul");
  const vTahun = document.getElementById("validate-tahun");
  const vPenulis = document.getElementById("validate-penulis");
  if (judul.value == "") {
    vJudul.innerHTML = "Form Ini Harus Di Isi";
    vPenulis.innerHTML = "";
    vTahun.innerHTML = "";
    return false;
  }
  if (penulis.value == "") {
    vPenulis.innerHTML = "Form Ini Harus Di Isi";
    vTahun.innerHTML = "";
    vJudul.innerHTML = "";
    return false;
  }
  if (terbit.value == "") {
    vTahun.innerHTML = "Form Ini Harus Di Isi";
    vJudul.innerHTML = "";
    vPenulis.innerHTML = "";
    return false;
  }
  if (parseInt(terbit.value) / 1 != parseInt(terbit.value)) {
    vTahun.innerHTML = "Form ini harus berupa angka";
    vPenulis.innerHTML = "";
    vJudul.innerHTML = "";
    return false;
  }
  vJudul.innerHTML = "";
  vPenulis.innerHTML = "";
  vTahun.innerHTML = "";
  return true;
}

//Menyimpan Data Ke Local Storage
function save() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
  }
  const parsed = JSON.stringify(list);
  localStorage.setItem("BOOK", parsed);
  loadFile();
}
//Mengambil Data Dari Local Storage
function loadFile() {
  const serializedData = localStorage.getItem("BOOK");
  let data = JSON.parse(serializedData);
  list.length = 0;
  for (i = 0; i < data.length; i++) {
    list.push(data[i]);
  }

  manageList(list);
}

//manajemen List
function manageList(buku) {
  const book = document.querySelectorAll(".book");
  for (i = 0; i < book.length; i++) {
    book[i].remove();
  }
  // Menampilkan Empty Holder
  if (buku.findIndex((item) => item.isComplete == true) < 0) {
    const empty = document.getElementById("empty2");
    empty.classList.remove("none");
    empty.classList.add("inline");
  }
  if (buku.findIndex((item) => item.isComplete == false < 0)) {
    const empty = document.getElementById("empty1");
    empty.classList.remove("none");
    empty.classList.add("inline");
  }

  //Memasukkan Elemen
  for (i = 0; i < buku.length; i++) {
    if (buku[i].isComplete == true) {
      const empty = document.getElementById("empty2");
      const div = empty.parentElement;
      empty.classList.add("none");
      empty.classList.remove("inline");
      let cont = addElem(
        buku[i].id,
        buku[i].title,
        buku[i].author,
        buku[i].year,
        buku[i].isComplete
      );
      div.appendChild(cont);
    } else {
      const empty = document.getElementById("empty1");
      const div = empty.parentElement;
      empty.classList.add("none");
      empty.classList.remove("inline");
      let cont = addElem(
        buku[i].id,
        buku[i].title,
        buku[i].author,
        buku[i].year,
        buku[i].isComplete
      );
      div.appendChild(cont);
    }
  }
}

//Membuat Elemen Untuk List
function addElem(id, jdl, pen, ter, bool) {
  //membuat Element h3
  const h3 = document.createElement("h3");
  const Judul = document.createTextNode(jdl);
  h3.appendChild(Judul);
  h3.classList.add("title");
  //Membuat elemet P
  const p1 = document.createElement("p");
  const p2 = document.createElement("p");
  const Penulis = document.createTextNode("penulis : " + pen);
  const Tahun = document.createTextNode("terbit : " + ter);
  p1.appendChild(Penulis);
  p2.appendChild(Tahun);
  //Membuat Id
  const p0 = document.createElement("p");
  const Ids = document.createTextNode(id);
  p0.appendChild(Ids);
  p0.style.display = "none";
  //membuat list
  const a1 = document.createElement("img");
  const a2 = document.createElement("img");
  const a3 = document.createElement("img");
  let src;
  let tanda;
  if (bool == true) {
    src = "assets/check-in.svg";
    tanda = "Tandai Belum Selesai";
  } else {
    src = "assets/check-out.svg";
    tanda = "Tandai Sudah Selesai";
  }
  a1.src = "assets/delete.svg";
  a1.classList.add("hapus");
  a1.style.width = "20px";
  a1.style.margin = "auto";
  a1.title = "Hapus buku";
  a2.src = "assets/edit.svg";
  a2.classList.add("edit");
  a2.style.width = "20px";
  a2.style.margin = "auto";
  a2.title = "Edit Buku";
  a3.src = src;
  a3.classList.add("ubah");
  a3.style.width = "20px";
  a3.style.margin = "auto";
  a3.title = tanda;
  const line = document.createElement("hr");
  const ico = document.createElement("div");
  ico.classList.toggle("ico");
  ico.classList.toggle("flex");
  ico.style.paddingTop = "5px";
  ico.appendChild(a1);
  ico.appendChild(a2);
  ico.appendChild(a3);
  //Membuat parent div
  const div = document.createElement("div");
  div.appendChild(p0);
  div.appendChild(h3);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(line);
  div.appendChild(ico);
  div.classList.add("book");
  return div;
}
// Search
function searching(a) {
  const lem = list.filter((list) =>
    list.title.toLowerCase().match(a.toLowerCase())
  );
  if (lem.findIndex((item) => item.isComplete == true) < 0) {
    const empty = document.getElementById("empty2");
    text = empty.firstChild;
    text.nextSibling.innerHTML = "Data Tidak Ditemukan";
    text.nextSibling.nextElementSibling.innerHTML = "Coba Kata Kunci Lain..";
  }
  if (lem.findIndex((item) => item.isComplete == false) < 0) {
    const empty = document.getElementById("empty1");
    text = empty.firstChild;
    text.nextSibling.innerHTML = "Data Tidak Ditemukan";
    text.nextSibling.nextElementSibling.innerHTML = "Coba Kata Kunci Lain..";
  }
  manageList(lem);
}
