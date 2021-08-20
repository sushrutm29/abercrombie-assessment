function handleButtonClick(id){
    var descr = document.getElementById(id);
    if (descr.style.display === "none") {
        descr.style.display = "block";
    } else {
        descr.style.display = "none";
    }
}