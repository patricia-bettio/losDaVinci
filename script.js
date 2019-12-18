window.addEventListener("DOMContentLoaded", init);

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);
    const category = urlParams.get("category");

    if (category) {
        getCategoryGallery(category);
    } else if (id) {
        makeModalWithImage();
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

function showGallery(jsonObj) {

    // Store the destination for the template copies once
    const destination = document.getElementById("galleryPage")

    // Create a loop through each json object from the link
    jsonObj.forEach(e => {

        // Store image info in variable
        const imgPath = e._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url

        // Store the template itself in a variable
        const templateG = document.querySelector(".galleryTemplate").content

        // Clone the template
        const galleryCopy = templateG.cloneNode(true)

        // Store the anchor object/a-tag around the image
        const anchor = galleryCopy.querySelector("a")

        // Store the image itself
        const imgGallery = galleryCopy.querySelector("a .img_Gallery")

        // Set the src-attribute
        imgGallery.setAttribute("src", imgPath)

        // Set the id-attribute
        imgGallery.setAttribute("id", e.id)

        // Append everything to the chosen destination
        destination.appendChild(galleryCopy)

        // Create a click event attached to the anchor tag around the image tag
        anchor.addEventListener('click', e => {

            // Stop the anchor from its default behavior
            e.preventDefault();

            // Call the function to handle the modal/pop-up
            manageModal(e);
        })
    })
}


function manageModal(clickedLink) {

    // Find the current target (the clicked element)
    let anchor = clickedLink.currentTarget;

    // Get the id of the child of the clicked element (the image id = the post id)
    let imageId = anchor.firstElementChild.getAttribute('id');
    //confirm: we are getting each post type image ID when clicking a single image
    console.log(imageId);
    makeModalWithImage(imageId);
}


//SUBpage - when selecting ONE single image - individual painting details page - to be trasformed into a MODAL
function makeModalWithImage(id) {
    /*// console.log("make sub here")
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");*/
    // console.log(id)

    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/gallery_page/" + id + "?_embed")
        .then(res => res.json())
        .then(showModal)

    //image
    function showModal(modalContent) {
        //alert("hello");
        console.log("modalContent", modalContent)

        //const templateG = document.querySelector(".container").content;
        //  const galleryCopy = templateG.cloneNode(true);

        const modalTitle = document.querySelector(".modalTitle");
        modalTitle.innerHTML = modalContent.title.rendered;

        const modalCont = document.querySelector(".modalContent");
        modalCont.innerHTML = modalContent.content.rendered;

        const dimension = document.querySelector(".dimensions");
        dimension.textContent = modalContent.img_dimensions;

        const materials = document.querySelector(".materials");
        materials.textContent = modalContent.img_material;

        //image
        const imgPath = modalContent._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
        console.log(imgPath)
        const modalImg = document.querySelector(".right img");
        modalImg.setAttribute("src", imgPath);

        const modal = document.querySelector(".modal-background");
        modal.addEventListener("click", () => {
            modal.classList.add("hide");
        });

        modal.classList.remove('hide');
        //4.append
        //document.querySelector("#galleryPage").appendChild(galleryCopy);
    }
}

function showModal(modalContent) {
    //alert("hello");
    console.log("modalContent", modalContent)

    //    const modal = document.querySelector(".modal-background");
    //    modal.addEventListener("click", () => {
    //                modal.classList.add("hide");
    //
    //                //const templateG = document.querySelector(".container").content;
    //                //const galleryCopy = templateG.cloneNode(true);
    //
    //                const pTitle = document.querySelector(".left p");
    //                pTitle.innerHTML = modalContent.title.rendered;
    //
    //                //image
    //                const imgPath = modalContent._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url;
    //                console.log(imgPath)
    //                const imgGallery = document.querySelector(".right img");
    //                imgGallery.setAttribute("src", imgPath);
    //
    //                document.querySelector(".modal-background").classList.remove("hide");

    //4.append
    //document.querySelector("#galleryPage").appendChild(galleryCopy);
}

//CATEGORY - gets paintings results based on category number

function getCategoryGallery(catId) {
    console.log("getCategoryGallery() called")
    console.log(catId)
    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/gallery_page?_embed&categories=" + catId)
        .then(res => res.json())
        .then(showGallery)
}

/*function showGallery(paintings) {
    console.log("paintings from one category", paintings)
    //console.log(theGallery)
    //loop the paintings in the array
    paintings.forEach(showPaintings);
}*/
//shows each painting
/*function showPaintings(painting) {
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
}*/









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
        categoryLink.setAttribute("href", "category.html?category=" + oneCategory.id + "#gallerySection");
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
