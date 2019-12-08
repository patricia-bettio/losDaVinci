window.addEventListener("DOMContentLoaded", init);

function init() {
    getAbout();
    getContact();
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

function getContact(){
    fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/contact_page/79")
    .then(res => res.json())
    .then(showContact)

    function showContact(contact){
        console.log(contact)
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
