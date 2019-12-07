window.addEventListener("DOMContentLoaded", init);

function init() {
    getAbout();
}

//ABOUT PAGE

function getAbout() {
       fetch("http://pbstyle.dk/wpinstall/wordpress/wp-json/wp/v2/about_page/71")
    //added 71 to the end so that I dont have to loop, data comes straight from About pod
        .then(res => res.json())
        .then(showAbout)

function showAbout(about) {
    console.log(about)
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
    document.querySelector("#aboutSection").appendChild(aboutCopy);
}
}
