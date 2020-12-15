window.onload = function(){
    // ALL PAGES
    WriteMenu();
    $('#sideMenu').hide();
    $('#toggle-menu').on("click",displaySideMenu);
    // INDEX.HTML

    if(window.location.href.includes("index.html")){
        WriteCategories();
        var catEl = document.getElementsByClassName("activity");
        //console.log(catEl[0])
        for(let i=0;i<catEl.length;i++){
            catEl[i].addEventListener("click",RemmemberID);
        }
        writePlaces();

        let catDivPos = $("#categories").offset().top;
        //console.log(catDivPos);
        
        $('#btnPlaces').on("click",function(){window.location.href="places.html"});

        $(window).on('scroll',()=> {
            let scroll = $(window).scrollTop();
            //console.log(scroll);
            if(scroll<catDivPos - 310){
                $('#categories').css("transform",`translateX(${-1900+scroll*1.7}px)`);
            }
            
        });
        $('.slickCarousel').slick({
            autoplay: true,
            autoplaySpeed: 2500,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true,
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });
    }

    // PLACES.HTML && ACTIVITIES.HTML
    if(window.location.href.includes("places.html") || window.location.href.includes("activities.html")){
        MakeDDL("ddlLocation",places);
        $("#ddlLocation").on("change",Filter);
    }
    if(window.location.href.includes("places.html")){

        MakeDDL("ddlAccType",accomodation);
        writeBoxes("accomodation",Lodging)
        $("#ddlAccType").on("change",Filter);
        writePriceButtons();
    }
    if(window.location.href.includes("activities.html")){

        MakeDDL("ddlActivity",categories);
        $("#ddlActivity").on("change",Filter);

        let activityID = localStorage.getItem("ActivityID");
        let locationID = localStorage.getItem('LocationID');
        if(locationID){
            WriteByLocalStorage(locationID,"Location",Activities);
        }else{
            WriteByLocalStorage(activityID,'Activity',Activities);
        }
    }
    
    // SUITCASE.HTML
    if(window.location.href.includes("suitcase.html")){

        // REG I LOG
        $("#btnLog").click(proveraLog);
        $("#btnReg").click(proverRegister);

        mesta = JSON.parse(localStorage.getItem("Mesta"));
        aktivnosti = JSON.parse(localStorage.getItem("Aktivnosti"));

        // Inicjalno
        $('#lodging').hide();
        $('#activity').hide();
        $(".message h2").html("Your suitcase is empty!");

        if((mesta && mesta.length>0) || (aktivnosti && aktivnosti.length>0)){            
            $(".message h2").html("");
        }
        if(mesta && mesta.length>0){
            $('#lodging').show();
            let niz = JSON.parse(localStorage.getItem('Mesta'));
            niz = Lodging.filter(el=>{
                for(let n of niz){
                    if(n.id==el.id){
                        return el;
                    }
                }
            })
            writeBoxes("accomodation",niz,$('#ispis2'));
        }
        if(aktivnosti && aktivnosti.length>0){
            $('#activity').show();
            let niz = JSON.parse(localStorage.getItem('Aktivnosti'));
            niz = Activities.filter(el=>{
                for(let n of niz){
                    if(n.id==el.id){
                        return el;
                    }
                }
            })
            writeBoxes("Activity",niz,$('#ispis1'));
        }
    }

    
    $(window).resize(CSS);
    CSS();
}


// TRENUTNA STRANICA
var url=window.location.href;

function displaySideMenu(e){
    e.preventDefault();
    $('#sideMenu').slideToggle();
}
// FILTRIRANJE SADRZAJA PO LOKACIJI / TIPU SMESTAJA / CENI i LOKACIJI/AKTIVNOSTI

function Filter(){
    let locationID = $("#ddlLocation option:selected").val();
    let filtriraniNiz;
    let type;
    if(url.includes("activities.html")){
        filtriraniNiz = Activities;
        type="Activity";
        let activityID = $("#ddlActivity option:selected").val();
        //console.log(activityID);
        if(activityID){
            if(activityID!=0){
                filtriraniNiz = Activities.filter(el=>el.activityID==activityID);
            }
        }
    }else if(url.includes("places.html")){
        filtriraniNiz = Lodging;
        type="accomodation";
        let accTypeID = $("#ddlAccType option:selected").val();
        console.log(accTypeID);
        if(accTypeID){
            if(accTypeID!=0){
                filtriraniNiz = Lodging.filter(el=>el.accTypeID==accTypeID);
            }
        }
        if($(this).hasClass("btn-price")){
            console.log(this.dataset.id)
            let low =  $(this).data('min');        
            let high = $(this).data('max');
            console.log(low)
            if(low=="" && high==""){
            }
            else{
                console.log(filtriraniNiz)
                filtriraniNiz = filtriraniNiz.filter(el=> el.price>low);
                filtriraniNiz = filtriraniNiz.filter(el=> el.price<high);
            }
        }
    }
   // console.log(locationID);
    if(locationID){
        if(locationID!=0){
            //console.log(locationID)
            filtriraniNiz = filtriraniNiz.filter(el=>el.locationID==locationID);
        }
    }
    
    
    writeBoxes(type,filtriraniNiz);
    $(".fadeIn").hide();
    $(".fadeIn").fadeIn();
    $(".fadeIn").fadeIn("slow");
    $(".fadeIn").fadeIn(4000);
}

//
// FUNKCIJE ZA DINAMICKO KREIRANJE I ISPISIVANJE DROPDOWN LISTI I SADRZAJA
//

//ISPIS MENIJA I FUNKCIOANLNOST AKTIVNOG LINKA

function WriteMenu(){
    var ul=document.getElementById('meni');
    for(let i=0; i<meni.length;i++){
        let li = document.createElement("li");
        li.setAttribute("class","col-lg-4 nav-item");
        let a = document.createElement('a');
        a.setAttribute("href",`${meni[i][1]}`);
        let txt = document.createTextNode(`${meni[i][0]}`);
        a.appendChild(txt);
        li.appendChild(a);
        ul.appendChild(li);
    }
    function ActiveLink(){
        var navLink= document.getElementsByClassName("nav-item");
        for(let i=0; i<navLink.length;i++){
            //console.log(navLink[i]);
            //console.log(url);
            if(url.search(navLink[i].firstChild.getAttribute("href"))!=-1){
                // console.log("dsd");
                navLink[i].firstChild.classList.add("active");
            }
        }
    }
    ActiveLink();
}


// ISPIS KATEGORIJA

function WriteCategories(){
    let div = document.getElementById("categories").firstElementChild;
    //console.log(div);
    let txt=``;
    for(let cat of categories){
        txt += `<div class="show-animation col-xl-3 col-lg-4 circles">
                <a class="activity" href="activities.html" data-id="${cat.id}">
                    <img src="assets/images/${cat.src}" alt="${cat.alt}"/>
                    <div class="hold"><h4>${cat.name}</h4></div>
                 </a>
            </div>`;
    }
    div.innerHTML=txt;
    var anim = $(".show-animation");
    //console.log(anim);
    for(let el of anim){
        //console.log(el);
        el.addEventListener("mouseenter",showActivity);
        el.addEventListener("mouseleave",hideActivity);
    }
}

// ISPIS PRICE DUGMICA

function writePriceButtons(){
    let html=``;
    
    for(let data of buttons){
        html+=`<button class="btn btn-secondary1 font-weight-bold btn-price" data-id="${data.id}" data-min="${data.price.low}" data-max="${data.price.high}" class="btn btn-secondary">${data.name}</button>`
    }
    $('.top-main-right').html(html);
    
    let buttoni = $('.btn-price');
    for(let b of buttoni){
        b.addEventListener("click",Filter);
    }
}
// function Alert(){
//     alert("dobio sam dogadjaj")
// }
// ISPIS LOKACIJA

function writePlaces(){
    div1 = document.getElementById('places');
    let style = document.createElement("style");
    let i=0;
    for(let obj of places){
        let divDest = document.createElement("div");
        let h4 = document.createElement("h4");
        let name = document.createTextNode(obj.name);
        style.innerHTML += `.place${i} {background-image:url("assets/images/${obj.image}");\nbackground-size:cover;\n
        background-repeat:no-repeat;\n}\n`;
        divDest.classList.add("places-box");
        divDest.classList.add(`place${i}`);
        divDest.setAttribute("data-pid",obj.id);
        h4.appendChild(name);
        divDest.appendChild(h4);
        div1.appendChild(divDest);
        divDest.addEventListener("click",function(){
            //alert(this.dataset.pid);
            localStorage.setItem("LocationID",this.dataset.pid);
            window.location.href="activities.html";

        })
        i++;
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}

//ISPIS DDL U ZAVISNOSTI OD STRINGA KOJI JE PROSLEDJEN

function MakeDDL(string,object){
    //console.log(string);
    let options;
    let div;
    if(string.includes('ddlLocation')){
        options = MakeOptions(object);
        div = document.getElementById(string);
        div.innerHTML+=options;
    }
    else if(string.includes('ddlActivity')){
        options = MakeOptions(object);
        div = document.getElementById(string);
        div.innerHTML+=options;
    }
    else if(string.includes('ddlAccType')){
        options = MakeOptions(object);
        div = document.getElementById(string);
        div.innerHTML+=options;
    }
}


// ISPIS SADRZAJA

// Kad je odabrana neka aktivnost klikom na neki krug aktivnosti
function WriteByLocalStorage(selectedID,string,object){

    if(selectedID!=null){
        switch(string){
            case "Activity":
                $(`#ddl`+string)[0].selectedIndex = selectedID;
                object = object.filter(el=> el.activityID == selectedID);
                //console.log(selectedID);
                console.log($(`#ddl`+string)[0].selectedIndex)
                console.log($(`#ddl`+string)[0])
                writeBoxes(string,object);
                localStorage.removeItem(string+"ID");
            break;
            case "Location":
                $(`#ddl`+string)[0].selectedIndex = selectedID;
                console.log($(`#ddl`+string)[0].selectedIndex)
                console.log($(`#ddl`+string)[0])
                object = object.filter(el=>el.locationID==selectedID);
                console.log(object);
                writeBoxes("Activity",object);
                localStorage.removeItem(string+"ID");
            break;
        }
    }else{
        writeBoxes(string,object);
    }

}

function writeBoxes(type,object,div=null,page=null){
    let html ="";
        if(object.length>0){
            if(type=='Activity'){
                html=MakeHTML(type,object);
                if(!div){                    
                    $('.middle-main').html(html);
                }else{
                    div[0].innerHTML = MakeHTML(type,object);                    
                    PromeniKlasePriInicijalnomIspisu(object);
                }
                $(".card-title").click(pokreniModal);
                $(".suitcase").click(AddToSuitcase);
            }
            else if(type=='accomodation'){
                html=MakeHTML(type,object);
                if(!div){                    
                    $('.middle-main').html(html);
                }else{
                    console.log(div)
                    div[0].innerHTML = MakeHTML(type,object);                    
                    PromeniKlasePriInicijalnomIspisu(object);
                }
                $(".suitcase").click(AddToSuitcase);
            }
        }else{
            if(!div){
                $('.middle-main').html("<h3 class='fadeIn'>No information for selected content!</h3>");
            }else{
                if(page=="Activity"){    
                    //alert(page)
                    localStorage.removeItem('Aktivnosti');                
                    $("#activity").hide();
                   
                }else if(page=="accomodation"){
                    //alert(page + 346);
                    localStorage.removeItem('Mesta');
                    $("#lodging").hide();
                   
                }
                if($("#lodging").css("display")=='none' && $("#activity").css("display")=='none'){
                    $(".message h2").html("Your suitcase is empty!"); 
                }
            }
        }
    if(url.includes("places.html")){
        let mesta = JSON.parse(localStorage.getItem('Mesta'));
        PromeniKlasePriInicijalnomIspisu(mesta);
    }else if(url.includes("activities.html")){
        let aktivnosti = JSON.parse(localStorage.getItem('Aktivnosti'));
        PromeniKlasePriInicijalnomIspisu(aktivnosti);
    }
}

// AKO JE U LS MENJA SE DEO SADRZAJA ODREDJENIH BOX-EVA

function PromeniKlasePriInicijalnomIspisu(ls){
    if(ls!=null){
        let all = $('.suitcase');
        //console.log(all)
        for(let a of all){
            //console.log(a);
            for(let obj of ls){
                if(a.dataset.id==obj.id){
                    console.log(a);
                    a.classList.remove('suitcase');
                    a.classList.add('remove')
                    let str = a.childNodes[0].innerHTML;
                    let newStr = str .replace("Add to","Remove from")
                    a.childNodes[0].innerHTML = newStr;
                }
            }
        }
        $('.remove').on("click",RemoveFromSuitcase);
    }
}

// DODAVANJE U SUITCASE U LS

function AddToSuitcase(){
    let outcome;
    if(url.includes("activities.html")){
        aktivnosti = JSON.parse(localStorage.getItem("Aktivnosti"));
        //console.log(aktivnosti)
        var id = this.dataset.id;
        //console.log(id)
        outcome = CheckAdd(aktivnosti,id,"Aktivnosti");

    }else if(url.includes("places.html")){
        mesta = JSON.parse(localStorage.getItem("Mesta"));
        var id = this.dataset.id;
        outcome = CheckAdd(mesta,id,"Mesta");
    }
    if(outcome){
        let str = this.childNodes[0].innerHTML;
        let newStr = str .replace("Add to","Remove from")
        this.childNodes[0].innerHTML = newStr;
        $(this).removeClass("suitcase").addClass('remove');
        $(this).on("click",RemoveFromSuitcase);

    }
}

// UKLANJANE IZ SUITCASE

function RemoveFromSuitcase(){
    
    var caller = this.dataset.id;
    var page = this.dataset.pg;
    console.log(caller,page)

    if(url.includes("suitcase.html")){
        if(page == "Activity"){
            let ls = JSON.parse(localStorage.getItem('Aktivnosti'));
            ls = ls.filter(el=> {
                if(el.id != caller)
                return el;
            })
            localStorage.setItem("Aktivnosti",JSON.stringify(ls));
            Activities = Activities.filter(el=>{
                for(let l of ls){
                    if(l.id==el.id){
                        return el;
                    }
                }
            })
            //alert(Activities);
            writeBoxes("Activity",Activities,$('#ispis1'),page);
        }else if(page == "accomodation"){
            //alert("prvo da")
            let ls = JSON.parse(localStorage.getItem('Mesta'));
            ls = ls.filter(el=> {
                if(el.id != caller)
                return el;
            })
            
            //alert(JSON.stringify(ls))
            localStorage.setItem("Mesta",JSON.stringify(ls));
            Lodging = Lodging.filter(el=>{
                for(let l of ls){
                    if(l.id==el.id){
                        return el;
                    }
                }
            })
            //alert(Lodging);
            writeBoxes("accomodation",Lodging,$('#ispis2'),page);
        }
    }else{
        //alert("DDD")
        let str = this.childNodes[0].innerHTML;
        let newStr = str .replace("Remove from","Add to")
        this.childNodes[0].innerHTML = newStr;
        $(this).removeClass("remove").addClass('suitcase');
        $(this).on("click",AddToSuitcase);

        if(page == "Activity"){
            let ls = JSON.parse(localStorage.getItem('Aktivnosti'));
            ls = ls.filter(el=> {
                if(el.id != caller)
                return el;
            })
            localStorage.setItem("Aktivnosti",JSON.stringify(ls));
        }else if(page == "accomodation"){
            let ls = JSON.parse(localStorage.getItem('Mesta'));
            ls = ls.filter(el=> {
                if(el.id != caller)
                return el;
            })
            localStorage.setItem("Mesta",JSON.stringify(ls));           
        }
    }        
}

// PROVERA PRE DODAVANJA U LS

function CheckAdd(array,id,string){
    if (array != null){
        if (array.filter(a=> a.id == id).length>0){
            //console.log("ne upisuje ponovo");
            return false;
        }
        else{
            array.push({
                id : id
            });
            localStorage.setItem(string,JSON.stringify(array));
        }
    }
    else{
        //alert("d");
        let niz=[];
        niz[0] = {
            id: id
        };
        //console.log(niz)
        localStorage.setItem(string,JSON.stringify(niz));
    }
    return true;
}

// POKRETANJE MODALA

// FUNKCIJA ZA POKRETANJA MODALA FILMA
function pokreniModal() {
    var id= this.dataset.id;
    console.log(this.dataset.id);
        let data = Activities;
        data= data.find(el => el.id==id);
        document.getElementById("actName").innerHTML= data.name;
        document.getElementById("actDescription").innerHTML= data.description;
        document.getElementById("actAddress").innerHTML= data.address;
        document.getElementById("actNumber").innerHTML= data.number;
        alert(id);    
        //$("#modalAct").modal("show");        
}


// KREIRANJE OPTION TAGOVA I KARTICA ZA SADRZAJ

function MakeOptions(object){
    let html = ``;
    for(let obj of object){
        html+= `<option value="${obj.id}">${obj.name}</option>`;
    }
    return html;
}

function MakeHTML(type,object){
    let html =``;
    if(type=='Activity'){
        for(let obj of object){
            html += `
            <div class="card fadeIn m-lg-4 m-md-2 m-sm-3 m-2 px-0  col-md-4 col-10">
                <img class="card-img-top" src="assets/images/${obj.image.src}" alt="${obj.image.alt}">
                <div class="card-body">
                    <h5 class="card-title font-weight-bold text-uppercase">${obj.name}</h5>
                    <p class="card-text truncate-overflow font-weight-normal my-2">${obj.description}</p>
                    <a href="#" data-id="${obj.id}"  data-toggle="modal" data-target="#modalAct" class="card-title h6 black mt-3 d-block text-black font-weight-bold">Learn more</a>
                </div>
                <div class="card-footer w-100 p-0 h-10 d-flex justify-content-evenly">
                    <div class="pt-xl-3 pt-lg-4 pt-md-3 pt-sm-3 pt-2 h-100 align-items-center col-6 text-center font-weight-bold"><a href="${obj.directions}"><p>Get directions</p></a></div>
                    <div data-pg="Activity" data-id="${obj.id}" class="suitcase py-3 col-6 bg-black d-flex align-items-center justify-content-center"><span class="font-weight-bold"><i class="fas fa-suitcase-rolling mx-2"></i>Add to suitcase</span></div>
                </div>
            </div>
            `;
        }
        return html;
    }
    else if(type=="accomodation"){
        for(let obj of object){
            html +=`
                <div class="card cit1 fadeIn m-lg-4 m-md-2 m-sm-3 m-2 px-0  col-md-5 col-10">
                    <img class="card-img-top" src="assets/images/${obj.image.src}" alt="${obj.image.alt}">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${obj.name}</h5>
                        <div class="d-flex justify-content-evenly px-3">
                            <p class="card-text fw-500 text-wrap w-50 p-0 align-self-center">${obj.address}</p>
                            <div class="col-5">
                                <a href="${obj.directions}"><p class="direction-link card-text a-card-color w-100 font-weight-bold text-uppercase" data-id="">Get Directions</p></a>
                                <p class="card-text fw-500">${obj.number}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer w-100 p-0 h-15 d-flex justify-content-evenly">
                        <div class="align-items-center col-6 d-flex justify-content-center text-center font-weight-bold">FROM <span class="mx-2">$${obj.price}</span></div>
                        <div data-pg="accomodation" data-id="${obj.id}" class="suitcase col-6 bg-black d-flex align-items-center justify-content-center"><span class="font-weight-bold"><i class="fas fa-suitcase-rolling mx-2"></i>Add to suitcase</span></div>
                    </div>
                </div>
            `;
        }
        return html;
    }
}

// JS OBJEKTI
// DDL SADRZAJ SE UZIMA IZ JS OBJEKATA

var meni = [["Things to do","activities.html"],["Places to stay","places.html"],["My Suitcase","suitcase.html"]];


// SADRZAJ ZA KATEGORIJE

var categories = [{"id":1,"name":"Redwoods","alt":"redwood forest","src":"Redwood.jpg"},{"id":2,"name":"Beaches","alt":"cloudy beach coast","src":"beach.jpg"},{"id":3,"name":"Hiking","alt":"hiking road","src":"hiking.png"},{"id":4,"name":"Water activities","alt":"people rafting","src":"wact.jpg"},{"id":5,"name":"Leisure","alt":"cycling break coast","src":"leisure.jpg"},{"id":6,"name":"Towns","alt":"town","src":"towns.jpg"},{"id":7,"name":"History","alt":"redwood tree","src":"historical.jpg"},{"id":8,"name":"Tours/Guides","alt":"road",
"src":"tour.jpg"}];

// SADRZAJ ZA DUGMICE
var buttons = [
                {"id":5,"name":"All","price":{"low":"","high":""}},
                {"id":1,"name":"$0-$79","price":{"low":0,"high":79}},
                {"id":2,"name":"$80-$149","price":{"low":80,"high":149}},
                {"id":3,"name":"$150-$250","price":{"low":150,"high":250}},
                {"id":4,"name":"$250+","price":{"low":250,"high":100000}}
            ]

// SADRZAJ ZA TIP SMESTAJA

var accomodation=[{"id":1,"name":"Bed & Breakfast"},{"id":2,"name":"Hotels & Motels"},{"id":3,"name":"Cabins & Cottages"},{"id":4,"name":"RV Parks & Campgrounds"}];


// SADRZAJ ZA MESTA

var places = [
    {
        "id":1,
        "name":"Eureka",
        "image":"eureka.jpg"
    },
    {
        "id":2,
        "name":"Arcata",
        "image":"arcata.jpg"
    }
    ,{
        "id":3,
        "name":"Fortuna",
        "image":"fortuna.jpg"
    }
    ,{
        "id":4,
        "name":"Ferndale",
        "image":"ferndale.jpg"
    },
    {
        "id":5,
        "name":"Trinidad",
        "image":"trinidad.jpg"
    },
    {
        "id":6,
        "name":"County East",
        "image":"east.jpg"
    },
    {
        "id":7,
        "name":"County North",
        "image":"north.jpg"
    },
    {
        "id":8,
        "name":"Southern Humboldt",
        "image":"southern.jpg"
    }
]


// SADRZAJ ZA AKTIVNOSTI

var Activities = [
    {"id":1,"image":{"src":"drive-thruu.jpg","alt":"SHRINE DRIVE THRU TREE, Redwood"},"name":"SHRINE DRIVE THRU TREE","description":"You know you’ve witnessed some of the largest trees on the planet when you find yourself driving your car through the very center of one. The Shrine and Drive-Over Tree (Myers Flat) allows you to return home again with photographs to prove you were not subject to ingesting some of the local forest mushrooms and did, indeed, pass directly through a living giant.","address":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975","directions":"https://www.google.com/maps/dir//13708+Avenue+of+the+Giants%2C+Myers+Flat%2C+CA+95554","locationID":8,"activityID":1},
    {"id":2,"image":{"src":"rhododendron.jpg","alt":"RHODODENDRON trail"},"name":"RHODODENDRON TRAIL","description":"To find the magic of the Rhododendron Trail you must first begin your journey at the Prairie Creek Visitor Center on the edge of scenic Elk Prairie. The trail is lined with lichen-encrusted maples, blackberry brambles, and magnificent redwoods. If you do anything in Humboldt make sure you don’t miss the beautiful scenery of the Rhododendron Trail.","address":"Prairie Creek Visitor Center, Newton B. Drury Scenic Parkway, Orick","number":"","directions":"https://www.google.com/maps/dir//Prairie+Creek+Visitor+Center%2C+Newton+B.+Drury+Scenic+Parkway%2C+Orick","locationID":7,"activityID":3},
    {"id":3,"image":{"src":"PatricksPoint.jpg","alt":"PATRICK’S POINT STATE PARK"},"name":"PATRICK’S POINT STATE PARK","description":"Patrick’s Point State Park is the perfect location to watch whales, sea lions, and beautiful sunsets. Appropriately located in the heart of the California redwood coast and considered one of the most magical treasures of the rugged Northern Coast. Take long and memorable strolls over safe, well-marked paths, bridges, steps and stairs winding in and around the crashing blue Pacific. Plus, get up close and personal in an ancient Sumeg village. A good camera is required on Rim Trail, Wedding Rock, Ceremonial Rock, and a never-ending display of why California is famous the world over.","address":"40630 CA-299, Willow Creek, CA 95573","number":"(530) 629-2263","directions":"https://www.google.com/maps/dir//4150+Patricks+Point+Drive%2C+Trinidad%2C+CA+95570","locationID":5,"activityID":2},
    {"id":4,"image":{"src":"bigfoot.jpg","alt":"Bigfoot Rafting"},"name":"BIGFOOT RAFTING","description":"Come join the Bigfoot Rafting family for river fun in the mountain sun! Bigfoot Rafting has been popular with tourist and locals alike since 1984, making them one of the largest and most experienced rafting company in Northern California. While they offer action-packed whitewater rafting to calm gentle floats safety always comes first. All guides are CPR, First Aid, and Swift Water Rescue certified. And there is no need to bring anything Bigfoot Rafting has all the gear and rafts you need. They even have a shuttle service that takes you to the rafting site.","address":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975","directions":"https://www.google.com/maps/dir//40630+CA-299%2C+Willow+Creek%2C+CA+95573","locationID":6,"activityID":4},
    {"id":5,"image":{"src":"willow-creek.jpg","alt":"willow creek lake"},"name":"WILLOW CREEK","description":"Come visit Bigfoot’s old stomping grounds. Where you can learn more about the hairy legend at the China Flat Bigfoot Museum with the world’s largest collection of Bigfoot artifacts. “River fun in the mountain sun” is a life motto here. Relax and enjoy never-ending private swimming holes, rock jumping into deep pools, and some of the best whitewater rafting you’ll ever experience.  There’s so much to do in Willow Creek, you’ll find yourself booking a trip to come back before you leave. You can even book a backcountry auto tour and get up close and personal with Six Rivers National Forest, enjoy a variety of wine tasting choices, sample the freshest produce from local farm stands, and as mentioned earlier…share a little quality-time with Bigfoot.","address":"Willow Creek, CA, USA","number":"","directions":"https://www.google.com/maps/dir//Willow+Creek%2C+CA%2C+USA","locationID":6,"activityID":5},
    {"id":6,"image":{"src":"ferndale-museum.jpg","alt":"Ferndale museum"},"name":"FERNDALE MUSEUM","description":"An experience you can only get in Ferndale. This is a historical and educational museum that brings the community an appreciation and understanding of the culture and heritage of Ferndale, the Eel River and Mattole Valleys. The museum publishes a magazine, produce original documentary videos, conduct tours of historic houses and businesses, stage photography exhibits, publish original biographies and historic cookbooks, and maintain a constantly enriched and varied collection. The museum’s collections include a working seismograph, player piano, active blacksmith shop, and a vast display of artifacts that pertain to or were used by our forebears. We also assist our members in genealogical research, welcome visitors and new friends, and provide information on our two town cemeteries.","address":"515 Shaw Ave, Ferndale, CA 95536","number":"(707) 786-4466","directions":"https://www.google.com/maps/dir//515+Shaw+Ave%2C+Ferndale%2C+CA+95536","locationID":4,"activityID":6},
    {"id":7,"image":{"src":"pacific-adventure.jpg","alt":"PACIFIC OUTFITTERS ADVENTURE, bus"},"name":"PACIFIC OUTFITTERS ADVENTURE","description":"Pacific Outfitters has been a part of the Humboldt community for years and a one-stop-shop for all your outdoor needs and information in Humboldt . Their appreciation for the outdoors carries over to the products they sell and the service you’ll receive. In each store department, you will find some of the top local experts of the area and provide the advice you’re in search of. Customers come in and share stories and photos, sign up for classes, pick up useful tips, and become educated on the latest, leading edge gear for the outdoors. The staff is made up of outfitting specialists who hunt, fish, hike, bike, snowboard, dive, kayak, play disc golf, other outdoor sports.","address":"1600 5th Street, Eureka, CA 95501 ","number":"(707)-443-6328","directions":"https://www.google.com/maps/dir//1600+5th+Street%2C+Eureka%2C+CA+95501","locationID":1,"activityID":7},
    {"id":8,"image":{"src":"arcata-marsh.jpg","alt":"ARCATA MARSH & WILDLIFE SANCTUARY"},"name":"ARCATA MARSH & WILDLIFE SANCTUARY","description":"The Arcata Marsh and Wildlife Sanctuary is an internationally popular wetland system. If you enjoy bird watching all year round, this is the place for you. Located at the northern end of the Humboldt Bay, the sanctuary is set along the migration route for thousands of birds that head north to California, Mexico and South and Central America.","address":"569 South G Street, Arcata, CA 95521","number":"(707) 826-2359","directions":"https://www.google.com/maps/dir//569+South+G+Street%2C+Arcata%2C+CA+95521","locationID":2,"activityID":8},
    {"id":9,"image":{"src":"grizzly-creek.jpg","alt":"GRIZZLY CREEK REDWOODS STATE PARK"},"name":"GRIZZLY CREEK REDWOODS STATE PARK","description":"Located on the Van Duzen River is the small yet beautiful Grizzly Creek Redwoods State Park. While the park only covers a few acres there are a number of things you can do, such as fishing, swimming, canoeing, and hiking. Very few visitors come on a weekday, so it is entirely possible to be the only person in the park.","address":"16949 State Highway 36, Carlotta, CA 95528","number":"(707)-777-3683","directions":"https://www.google.com/maps/dir//1600+5th+Street%2C+Eureka%2C+CA+95501","locationID":3,"activityID":1}
];

// SADRZAJ ZA SMESTAJ

var Lodging = [
    {"id":1,"name":"Cornelius Daly Inn","image":{"src":"holiday-inn-express-and-suites-eureka.jpg","alt":"cornelius daly inn"},"price":130,"address":"1125 H Street, Eureka, CA 95501","number":"(707) 445-3638","directions":"https://www.google.com/maps/dir//1125+H+St,+Eureka,+CA+95501,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.7968961,-124.2322344,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d3ffd8efbc5419:0x4c451ecf9495c779!2m2!1d-124.1621945!2d40.7969173","locationID":1,"accTypeID":1},
    {"id":2,"name":"MAD RIVER RAPIDS RV PARK","image":{"src":"mad-river-rapids-rv-park.jpg","alt":"mad river rapids rv park"},"price":42,"address":"3501 Janes Road, Arcata, CA 95521","number":"(707) 822-7275","directions":"https://www.google.com/maps/dir//3501+Janes+Rd,+Arcata,+CA+95521,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.9016469,-124.093386,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d150ab8aee0305:0xad53e93a0630388d!2m2!1d-124.0911973!2d40.9016469","locationID":2,"accTypeID":4},
    {"id":3,"name":"RIVERS'S EDGE RV PARK","image":{"src":"RiversEdgeRVPark.jpg","alt":"River's Edge RV park"},"price":50,"address":"620 Davis Street, Rio Dell, CA","number":"(707) 764-5420","directions":"https://www.google.com/maps/dir//620+Davis+Street%2C+Rio+Dell%2C+CA","locationID":3,"accTypeID":2},
    {"id":4,"name":"VICTORIAN INN BOUTIQUE HOTEL","image":{"src":"victorian-inn-front-daylight.jpg","alt":"VICTORIAN INN BOUTIQUE HOTEL"},"price":149,"address":"400 Ocean Avenue, Ferndale, CA 95536","number":"(707) 786-4949","directions":"https://www.google.com/maps/dir//400+Ocean+Avenue%2C+Ferndale%2C+CA+95536","locationID":4,"accTypeID":3},
    {"id":5,"name":"TURTLE ROCK OCEANFRONT INN","image":{"src":"turtle.jpg","alt":"TURTLE ROCK OCEANFRONT INN"},"price":189,"address":"3392 Patricks Point Drive, Trinidad, CA 95570","number":"(707) 677-3707","directions":"https://www.google.com/maps/dir//3392+Patricks+Point+Drive%2C+Trinidad%2C+CA+95570","locationID":5,"accTypeID":3},
    {"id":6,"name":"DEAN CREEK RESDORT","image":{"src":"dean-creek.webp","alt":"dean creek resort"},"price":84,"address":"4112 Redwood Drive, Redway, CA 95542","number":"(707) 923-2555","directions":"https://www.google.com/maps/dir//4112+Redwood+Dr,+Redway,+CA+95560,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.1407506,-123.8125965,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d492c246cf94e1:0x170a3d6a5323fe91!2m2!1d-123.8104078!2d40.1407506","locationID":8,"accTypeID":3},
    {"id":7,"name":"COHO COTTAGES HOTEL","image":{"src":"coho.webp","alt":"cogo cottages hotel"},"price":159,"address":"76 Willow Road, Willow Creek, CA 95573","number":"(530) 629-4000","directions":"https://www.google.com/maps/dir//76+Willow+Rd,+Willow+Creek,+CA+95573,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.9412058,-123.6353805,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d3d835d44686b1:0x82027f9badf8ee96!2m2!1d-123.6331918!2d40.9412058","locationID":6,"accTypeID":3},
    {"id":8,"name":"GIANT REDWOODS RV & CAMP","image":{"src":"giant-redwood.jpg","alt":"GIANT REDWOODS RC & CAMP"},"price":35,"address":"400 Myers Avenue, Myers Flat, CA 95554","number":"(707) 943-9999","directions":"https://www.google.com/maps/dir//7+Valley+Green+Camp+Road%2C+Orick%2C+CA+95555","locationID":8,"accTypeID":4},
    {"id":9,"name":"ELK MEADOW VILLAGE IN REDWOOD NATIONAL PARK","image":{"src":"elk-meadow.jpg","alt":"elk meadow village, redwood national park"},"price":289,"address":"7 Valley Green Camp Road, Orick, CA 95555","number":"(866) 733-9637","directions":"https://www.google.com/maps/dir//7+Valley+Green+Camp+Road%2C+Orick%2C+CA+95555","locationID":7,"accTypeID":3},
];


// ***

// DODATNO

// ***


// ANIMATE METOD

function showActivity(){
    $(this).children().find(".hold").stop(true,true).animate({"opacity":"1","transition":"opacity 0.7s"});
}
function hideActivity(){
    $(this).children().find(".hold").stop(true,true).animate({"opacity":"0","transition":"opacity 0.4s"});
}

// Local Storage funkcionalnost

function RemmemberID(e){
    e.preventDefault();
    localStorage.setItem("ActivityID",this.dataset.id);
    window.location.href="activities.html";
    // alert(this.dataset.id);

}

//REGULRANI IZRAZI
var reEmail,rePassword;
reEmail = /^([a-z]{3,}\d{0,}\@((gmail|yahoo)\.com)|ict\.edu\.rs)|([a-z]{3,}\d{0,}\.[a-z]{3,}\d{0,}\@((gmail|yahoo)\.com)|ict\.edu\.rs)$/;
rePassword= /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15})$/;

//LOGOVANJE
function proveraLog(e){
    e.preventDefault();
    var email, pass;
    email = $("#emailLog").val();
    pass= $("#pass").val();
    
    //alert(pass)
    let fail=[];
    if(!rePassword.test(pass) || pass.length==0){
        $("#pass").css("border-color","#ee0f0f").next().text("Password or username don't match!");
        fail[0]="Bad password";
    }
    else{
        $("#pass").css("border-color","#08b108").next().text(" ");

        
    }
    if(!reEmail.test(email)){
        $("#emailLog").css("border-color","#ee0f0f").attr("placeholder","eg. john@gmail.com");
        fail[1]='Bad email';
    }
    else{
        $("#emailLog").css("border-color","#08b108");
    }
    if(fail.length==0){
        setTimeout(function(){
            window.location.href = "https://dzo00.github.io/Viator/suitcase.html"
        },1000);
    }
}

//REGISTRACIJA
function proverRegister(e){
    e.preventDefault();
    
    var ime, reIme, email, password;
    ime= document.getElementById("name").value;
    
    email = $("#emailReg").val();
    password= $("#password").val();
    passCheck= $("#passwordRepeat").val();
    console.log(password); console.log(passCheck);
    reIme=/^[A-Z][a-z]{2,12}(\s[A-z][a-z]{2,12})+$/;

    let error=[];

    if(!reIme.test(ime)){
        $("#name").css("border-color","#ee0f0f").attr("placeholder","eg. John Doe");
        error[0]="bad name";
    }
    else{
        $("#name").css("border-color","#08b108");
    }
    if(!rePassword.test(password) || password.length==0){
        $("#password").css("border-color","#ee0f0f").next().text("Password must contain at least one uppercased letter, an lowercased letter, number and have 8-15 characters!");
        error[0]="bad password";
    }
    else{
        $("#password").css("border-color","#08b108").next().text(" ");
    }
    if(!reEmail.test(email)){
        $("#emailReg").css("border-color","#ee0f0f").attr("placeholder","eg. john@gmail.com");
        error[0]="bad email";
    }
    else{
        $("#emailReg").css("border-color","#08b108");
    }
    if(!rePassword.test(passCheck) && passCheck==""){
        $("#passwordRepeat").css("border-color","#ee0f0f").next().text("Password must contain at least one uppercased letter, an lowercased letter, number and have 8-15 characters!");
        error[0]="bad pass";
    }
    else if(passCheck!=password){
        $("#passwordRepeat").css("border-color","#ee0f0f").next().text("Passwords don't match!");
        error[0]="pass dont match";
    }
    else{
        $("#passwordRepeat").css("border-color","#08b108").next().text(" ");
    }
    if(error.length==0){
        $("#passwordRepeat").next().text("Welcome our new Viator!");
        $("#passwordRepeat").next().css("font-weight","bold")
        $("#passwordRepeat").next().removeClass('text-danger').addClass("text-success");
        setTimeout(function(){
            window.location.href = "https://dzo00.github.io/Viator/suitcase.html"
        },1000);
    }  
}

// GLUPI CSS - hate it x(
function CSS(){
    if(url.includes('index.html')){
        let div =  document.getElementsByClassName("headline")[1];
        //console.log(div);
        div.style.padding="0px 60px 0px 0px";
    }
    if(url.includes('places.html')){
        if(screen.width<1100){
            console.log($('.card-body p'))
            let cards = $('.card-body p');
            for(let card of cards){
                card.style.fontSize = '13px'
            }
            
        }
        console.log(screen.width<930)
        if(screen.width<930){
            
            let h5 = $('.card-body h5');
            for(let h5s of h5){
                h5s.style.fontSize = '15px'
            }
        }
    }

    if(url.includes('suitcase.html')){
        let cards= $('.card');
        for(let card of cards){
            card.classList.remove('col-md-4');
            card.classList.add('col-md-5')
        }
    }
    //1024px MENI
    if(screen.width<1024){
        $('#meni').hide();
        $('#toggle-menu').show();
    }else{
        $('#meni').show();
        $('#toggle-menu').hide();
        $('#sideMenu').hide();
    }
}
