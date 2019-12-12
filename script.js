window.addEventListener("DOMContentLoaded", init);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);
    const category = urlParams.get("category");

    if (category) {
        getCategoryGallery(category);
    } else if (id) {
        makeSub();
    }
    //If on the index.html page, run the getGallery page-all results
    //all results- only on Index page
    console.log("am i on index?", window.location.href.includes("index"))

    if (window.location.href.includes("index")) {
        getGallery();
    }

    getAbout();
    getContact();
    getCategories();
}

//ABOUT PAGE

function getAbout() {
    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/about_page/71")
        //added 71 to the end so that I dont have to loop, data comes straight from About pod
        .then(res => res.json())
        .then(showAbout)

    function showAbout(about) {
        //console.log(about)
        //1.Clone the template
        const templateA = document.querySelector(".aboutTemplate").content;
        const aboutCopy = templateA.cloneNode(true);
        //2.Text content
        const desc = aboutCopy.querySelector(".aboutText");
        desc.innerHTML = about.content.rendered;
        const aboutT = aboutCopy.querySelector(".aboutTitle");
        aboutT.innerHTML = about.title.rendered;

        const imgAbout = aboutCopy.querySelector("img.about_img");
        imgAbout.setAttribute("src", about.about_image.guid);
        //create function: if no data, dont display for the subtitle
        //3.Append
        document.querySelector("#aboutPage").appendChild(aboutCopy);
    }
}

//CONTACT PAGE

function getContact() {
    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/contact_page/79")
        .then(res => res.json())
        .then(showContact)

    function showContact(contact) {
        //console.log(contact)
        //1.clone the template
        const templateC = document.querySelector(".contactTemplate").content;
        const contCopy = templateC.cloneNode(true);
        //2.get content
        const mail = contCopy.querySelector(".contactMail");
        mail.textContent = contact.contact_mail;
        const insta = contCopy.querySelector(".contactInsta");
        insta.textContent = contact.contact_insta;
        const phone = contCopy.querySelector(".contactPhone");
        phone.textContent = contact.contact_phone;

        const imgCont = contCopy.querySelector("img.contact_img");
        imgCont.setAttribute("src", contact.contact_img.guid);
        //3.append
        document.querySelector("#contactPage").appendChild(contCopy);
    }
}

//GALLERY PAGE
//SHOW GALLERY - INDEX page - all results

function getGallery() {
    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/gallery_page?_embed")
        .then(res => res.json())
        .then(showGallery)
}


//SUBpage - when selecting ONE single image - individual painting details page - to be connected with LUCCI

function makeSub() {
    console.log("make sub here")
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id)

    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/gallery_page/" + id + "?_embed")
        .then(res => res.json())
        .then(showGallery)

    //image
    function showGallery(painting) {
        console.log("painting", painting)

        const templateG = document.querySelector(".individualPaintingTemplate").content;
        const galleryCopy = templateG.cloneNode(true);

        //        const pTitle = galleryCopy.querySelector(".paintTitle");
        //        pTitle.innerHTML = painting.title.rendered;
        //image
        const imgPath = painting._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
        console.log(imgPath)
        const imgGallery = galleryCopy.querySelector(".img_Gallery");
        imgGallery.setAttribute("src", imgPath);
        //4.append
        document.querySelector("#galleryPage").appendChild(galleryCopy);
    }
}
//



//CATEGORY - gets paintings results based on categpory number

function getCategoryGallery(catId) {
    console.log("getCategoryGallery() called")
    console.log(catId)
    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/gallery_page?_embed&categories=" + catId)
        .then(res => res.json())
        .then(showGallery)
}


function showGallery(paintings) {
    console.log("paintings from one category", paintings)
    //console.log(theGallery)
    //loop the paintings in the array
    paintings.forEach(showPaintings);
}
//shows each painting
function showPaintings(painting) {
    console.log(painting);
    console.log(painting._embedded["wp:featuredmedia"])
    //2.clone the template
    //image
    const imgPath = painting._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
    console.log(imgPath)
    const templateG = document.querySelector(".galleryTemplate").content;
    const galleryCopy = templateG.cloneNode(true);

    const a = galleryCopy.querySelector("a");

    const imgGallery = galleryCopy.querySelector(".img_Gallery");
    imgGallery.setAttribute("src", imgPath);
    //4.append
    document.querySelector("#galleryPage").appendChild(galleryCopy);
}



//CATEGORIES MENU - finds the categories and make them a nav link

function getCategories() {
    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/categories?")
        .then(res => res.json())
        .then(categories => {
            //Loop the array of categories
            //console.log(categories)
            categories.forEach(addCategory)
        })
}
//show each category
function addCategory(oneCategory) {
    //console.log(oneCategory.name)
    //&& oneCategory.count > 0) - if there were EMPTY categories not to be included - not this case
    if (oneCategory.parent === 24 && oneCategory.count > 0) {
        const categoryLink = document.createElement("a");
        categoryLink.textContent = oneCategory.name;
        categoryLink.setAttribute("href", "category.html?category=" + oneCategory.id);
//        categoryLink.setAttribute("id", oneCategory.id);
        document.querySelector("#categoryMenu").appendChild(categoryLink);
    }

}


//RESPONSIVE MENU
function myFunction() {
    var x = document.getElementById("homemenu");
    if (x.className === "homemenu") {
        x.className += " responsive";
    } else {
        x.className = "homemenu";
    }
}

//MODAL
function showModal() {
    let modal = document.getElementById("#modalPainting");
    modal
    //    modal.classList.remove('hide');
    //    const id = e.target.getAttribute('data-id');
    //    console.log(AllData);
    //    console.log(AllData[id - 1].gsx$filmname.$t)
    //    modal.querySelector(".modal-title").textContent = AllData[id - 1].gsx$filmname.$t;
    //    modal.querySelector(".modal-description").textContent = AllData[id - 1].gsx$longdescription.$t;
    //    modal.querySelector(".modal-budgetS").textContent = AllData[id - 1].gsx$budget.$t;
    //    modal.querySelector(".modal-image").setAttribute("src", "imgs/" + AllData[id - 1].gsx$image.$t);
    //modal.querySelector(".modal-description").textContent = e.longdescription;
    //modal.classList.remove("hide");*/
}
showModal();

//close the modal when clicked
const modal = document.querySelector(".modal-background");

modal.addEventListener("click", () => {
    modal.classList.add("hide");
});
