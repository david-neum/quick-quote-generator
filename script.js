const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const addItemBtn = document.getElementById("addItemBtn");
const deleteItemBtn = document.getElementById("deleteItemBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const downloadBtn = document.getElementById("downloadBtn");
const textOutput1 = document.getElementById("textOutput1");
const totalQuoteOutput = document.getElementById("totalQuoteOutput");
const selCurrency = document.getElementById("selCurrency");
const selItem = document.getElementById("selItem");
const notice = document.getElementById("notice");

let items = [];
let currency = "$";
let confirmDelete = false;
let quote = 0;

function updateCurrency() {
    if (selCurrency.selectedIndex == 0) {
        currency = "$";
        return "$"
    } else if (selCurrency.selectedIndex == 1) {
        currency = "£";
        return "£";
    } else {
        currency = "€";
        return "€";
    }
}

function addItem(n, p) {
    if (n != "" && p != "") {
        items.push({item: n, price: p});
        itemInput.value = "";
        priceInput.value = "";
    } else if (n === "" && p === "") {
        notice.innerHTML = "Description and price cannot be empty!";
        notice.style.display = "block";
    } else if (n === "") {
        notice.innerHTML = "Description cannot be empty!";
        notice.style.display = "block";
    } else {
        notice.innerHTML = "Price cannot be empty! (Must be a number!)";
        notice.style.display = "block";        
    }
}

function totalQuote() {
    quote = 0;
    for (let i=0; i<items.length; i++) {
        quote = (quote + parseInt(items[i].price));
    }

    if (currency === "€") {
        return quote + currency;
    } else {
        return currency + quote;
    }
    
}

function updateOutput() {
    textOutput1.innerHTML = "";
    //regional formatting
    if (updateCurrency() === "€") {
        for (let i=0; i<items.length; i++) {
            textOutput1.innerHTML += (i+1) + ". " + items[i].item + " – " + items[i].price + currency + "<br>";
        }
    } else {
        for (let i=0; i<items.length; i++) {
            textOutput1.innerHTML += (i+1) + ". " + items[i].item + " – " + currency + items[i].price + "<br>";
        }        
    }
    
    totalQuoteOutput.innerHTML = "Total Quote: " + totalQuote();
}

function deleteItem() {
    let target = selItem.selectedIndex;
    items.splice(target, 1);
}

function deleteAll() {
    items = [];
    updateOutput();
    updateList();
}

function updateList() {
    selItem.innerHTML = "";
    for (let i=0; i<items.length; i++) {
        selItem.insertAdjacentHTML("beforeend", "<option>" + items[i].item + "</option>");
    }
}

function downloadQuote() {
    let text = "";

    if (currency === "€") {
        for (let i = 0; i < items.length; i++) {
            text += (i + 1) + ". " + items[i].item + " - " + items[i].price + currency + "\n";
        }
        text += "\nTotal Quote: " + quote + currency;

    } else {
        for (let i = 0; i < items.length; i++) {
            text += (i + 1) + ". " + items[i].item + " - " + currency + items[i].price + "\n";
        }        
        text += "\nTotal Quote: " + currency + quote;

    }

    let file = new Blob([text], { type: "text/plain" });
    let url = URL.createObjectURL(file);

    let link = document.createElement("a");
    link.href = url;
    link.download = "quote.txt";
    link.click();

    URL.revokeObjectURL(url);
}

itemInput.addEventListener("focusin", () => {
    notice.style.display = "none";
})

priceInput.addEventListener("focusin", () => {
    notice.style.display = "none";
})

selCurrency.addEventListener("change", updateOutput);

addItemBtn.addEventListener("click", () => {
    addItem(itemInput.value, priceInput.value);
    updateOutput();
    updateList();
})

deleteItemBtn.addEventListener("click", () => {
    deleteItem();
    updateOutput();
    updateList();
})

deleteAllBtn.addEventListener("click", () => {
    if (confirmDelete === false) {
        deleteAllBtn.textContent = "Click to confirm";
        confirmDelete = true;
    } else {
        deleteAll();
        deleteAllBtn.textContent = "Delete all items";
        confirmDelete = false;
    }
});

deleteAllBtn.addEventListener("mouseout", () => {
    if (confirmDelete === true) {
        deleteAllBtn.textContent = "Delete all items";
        confirmDelete = false;        
    }
})

downloadBtn.addEventListener("click", downloadQuote);