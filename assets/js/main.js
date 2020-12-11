window.onload = function(){
    WriteMenu();

    if(window.location.href.includes("index.html")){
        $("#btnPlaces").click(function(){
            window.location.href="places.html";
        })
        WriteCategories();
        var catEl = document.getElementsByClassName("activity");
        //console.log(catEl[0])
        for(let i=0;i<catEl.length;i++){
            catEl[i].addEventListener("click",RemmemberID);
        }
        writePlaces();
        CSS();
        let catDivPos = $("#categories").offset().top;
        //console.log(catDivPos);
        $(window).on('scroll',()=> {
            let scroll = $(window).scrollTop();
            //console.log(scroll);

            if(scroll<=catDivPos - 290.7){
                $('#categories').css("transform",`translateX(${-2000+scroll*1.8}px)`);
            }
        })
    }
    if(window.location.href.includes("places.html")){

        MakeDDL("ddlAccType",accomodation);
        writeBoxes("accomodation",Lodging)
        $("#ddlAccType").on("change",Filter);
    }
    if(window.location.href.includes("activities.html")){

        MakeDDL("ddlActivity",categories);
        $("#ddlActivity").on("change",Filter);

        let activityID = localStorage.getItem("ActivityID");
        WriteByLocalStorage(activityID,"Activity",Activities);
    }
    if(window.location.href.includes("places.html") || window.location.href.includes("activities.html")){
        MakeDDL("ddlLocation",places);
        $("#ddlLocation").on("change",Filter);
    }


}

// TRENUTNA STRANICA
var url=window.location.href;


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
        console.log(filtriraniNiz)
    }
    console.log(locationID);
    if(locationID){
        if(locationID!=0){
            console.log(locationID)
            filtriraniNiz = filtriraniNiz.filter(el=>el.locationID==locationID);
        }
    }
    console.log(filtriraniNiz)
    writeBoxes(type,filtriraniNiz);
}

//
// FUNKCIJE ZA DINAMICKO KREIRANJE I ISPISIVANJE DROPDOWN LISTI I SADRZAJA
//

//ISPIS MENIJA I FUNKCIOANLNOST AKTIVNOG LINKA

function WriteMenu(){
    var ul=document.getElementById('meni');
    for(let i=0; i<meni.length;i++){
        let li = document.createElement("li");
        li.setAttribute("class","col-lg-3 nav-item");
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
        txt += `<div class="show-animation col-lg-3 circles">
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
            localStorage.setItem("PlaceID",this.dataset.pid);
            window.location.href="places.html";
            //DORADITI OVU FUNKCIONALNOST ZA NOVU STR ;)
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
        //console.log(selectedID);
        $(`#ddl`+string)[0].selectedIndex = selectedID;
        object = object.filter(el=> el.activityID == selectedID);
        writeBoxes(string,object);
        localStorage.removeItem("ActivityID");
    }else{
        writeBoxes(string,object);
    }

}

function writeBoxes(type,object){
    let html ="";
    console.log(object);
        if(object.length>0){
            if(type=='Activity'){
                html=MakeHTML(type,object);
                $('.middle-main').html(html);
                $(".suitcase").click(AddToSuitcase);
            }
            else if(type=='accomodation'){
                html=MakeHTML(type,object);
                $('.middle-main').html(html);                
                $(".suitcase").click(AddToSuitcase);
            }
        }else{
            $('.middle-main').html("No information for selected content!");
        }
    if(url.includes("places.html")){        
        let mesta = JSON.parse(localStorage.getItem('Mesta'));
        PromeniKlasePriInicijalnomIspisu(mesta);
    }else if(url.includes("activities.html")){
        let aktivnosti = JSON.parse(localStorage.getItem('Aktivnosti'));
        PromeniKlasePriInicijalnomIspisu(aktivnosti);
    }
}
function PromeniKlasePriInicijalnomIspisu(ls){
    if(ls!=null){            
        let all = $('.suitcase');
        console.log(all)
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
    }
}
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
        
    }else{
        alert("You already added it!");
    }
}

function RemoveFromSuitcase(){
    
}

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
            <div class="card m-3">
                <img class="card-img-top" src="assets/images/Redwood.jpg" alt="${obj.image.alt}">
                <div class="card-body">
                    <h5 class="card-title font-weight-bold text-uppercase">${obj.name}</h5>
                    <p class="card-text truncate-overflow font-weight-normal my-2">${obj.description}</p>
                    <a href="#" data-id="${obj.id}" class="h6 black mt-3 d-block text-black font-weight-bold">Learn more</a>
                </div>
                <div class="card-footer w-100 p-0 h-10 d-flex justify-content-evenly">
                    <div class="py-3 h-100 align-items-center col-6 text-center font-weight-bold"><a href="${obj.directions}"><p>Get directions</p></a></div>
                    <div data-pg="act" data-id="${obj.id}" class="suitcase py-3 col-6 bg-black d-flex align-items-center justify-content-center"><span class="font-weight-bold"><i class="fas fa-suitcase-rolling mx-2"></i>Add to suitcase</span></div>
                </div>
            </div>
            `;
        }
        return html;
    }
    else if(type=="accomodation"){
        for(let obj of object){
            html +=`
                <div class="card m-3">
                    <img class="card-img-top" src="assets/images/Redwood.jpg" alt="${obj.image.alt}">
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
                        <div data-pg="acc" data-id="${obj.id}" class="suitcase col-6 bg-black d-flex align-items-center justify-content-center"><span class="font-weight-bold" data-id=""><i class="fas fa-suitcase-rolling mx-2"></i>Add to suitcase</span></div>
                    </div>
                </div>
            `;
        }
        return html;
    }
}

// JS OBJEKTI
// DDL SADRZAJ SE UZIMA IZ JS OBJEKATA

var meni = [["Things to do","activities.html"],["Places to stay","places.html"],["Discover the country","explore.html"],["My Suitcase","suitcase.html"]];


// SADRZAJ ZA KATEGORIJE

var categories = [{"id":1,"name":"Redwoods","alt":"redwood forest","src":"Redwood.jpg"},{"id":2,"name":"Beaches","alt":"cloudy beach coast","src":"beach.jpg"},{"id":3,"name":"Hiking","alt":"hiking road","src":"hiking.png"},{"id":4,"name":"Water activities","alt":"people rafting","src":"wact.jpg"},{"id":5,"name":"Leisure","alt":"cycling break coast","src":"leisure.jpg"},{"id":6,"name":"Towns","alt":"town","src":"towns.jpg"},{"id":7,"name":"History","alt":"redwood tree","src":"historical.jpg"},{"id":8,"name":"Tours/Guides","alt":"road",
"src":"tour.jpg"}];

// SADRZAJ ZA TIP SMESTAJA

var accomodation=[{"id":1,"name":"Bed & Breakfast"},{"id":2,"name":"Hotels & Motels"},{"id":3,"name":"Cabins & Cottages"},{"id":4,"name":"RV Parks & Campgrounds"}];


// SADRZAJ ZA MESTA

var places = [
    {
        "id":1,
        "name":"Eureka",
        "description": ["Tucked just inland of Humboldt Bay, Eureka is the largest city between San Francisco and Portland and the perfect home base for your Redwood adventure.","Filled with a rich history of gold mining and bustling port activity, nowhere is Eureka’s Victorian heritage more evident than in Old Town. Here you’ll find a meticulously restored district of shops, restaurants, galleries and museums. The Eureka Boardwalk is open for strolling and baywatching and is also home to the Carsion Mansion. If it is a water-facing activity you’re looking for, you’ll have no problem finding waterfront dining opportunities, kayaking excursions, oyster tours, or sunset cruises. Leaving, however, will be a challenge.","Head inland from the bay and you’ll find it hard to miss the massive old-growth redwood forest smack dab in the middle of Eureka (just under 70 acres to be exact). Developed trails, stairways, bridges and corduroy roads make this an easy adventure. Don’t forget to stop by the Sequoia Zoo to say hi to our magnificent red pandas or check out the new river otter experience. Few cities the size of Eureka have zoos, let alone world-class exhibits such as these.","Whether it is before or after you find yourself lost amongst the ever-famous Redwoods of Humboldt County, Eureka is a perfect jumping off point on any itinerary."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96670.51439250342!2d-124.21894337272111!3d40.78503477657445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d3ff83e6ff4ea7%3A0x2a860766b8290695!2z0IjRg9GA0LjQutCwLCDQmtCw0LvQuNGE0L7RgNC90LjRmNCwLCDQodGY0LXQtNC40ZrQtdC90LUg0JTRgNC20LDQstC1!5e0!3m2!1ssr!2srs!4v1607464516929!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"eureka.jpg"
    },
    {
        "id":2,
        "name":"Arcata",
        "description": ["Arcata encompasses all that’s great about Humboldt County, from the giant Redwoods of the Community Forest to the eccentric and spirited streets downtown. With its lush green lawns and vibrant flowerbeds, The Plaza in central Arcata is perhaps the liveliest gathering spot in all of Humboldt. Delightful shops line quaint streets, as locals, tourists, and intellectuals wander, gawk, and ponder.","Being that Arcata is a college town, you might find the bookstores and coffee shops of particular interest. At certain times of the year, you might stumble upon the Kinetic Sculpture Race, or the world-famous Oyster Festival.","And do find the time to take a self-guided tour of the many beautifully restored Victorian homes. If “big city” life isn’t for you, take a walk on the wild side at the Arcata Marsh and Wildlife Sanctuary, or perhaps do a bit of hiking or biking amongst the trees in Arcata Community Forest and Redwood Park."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96582.59358643861!2d-124.12326392076943!3d40.84539972001063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d1570e67b9e801%3A0x7d8ad78fa1858786!2z0JDRgNC60LXRmNGC0LAsINCa0LDQu9C40YTQvtGA0L3QuNGY0LAsINCh0ZjQtdC00LjRmtC10L3QtSDQlNGA0LbQsNCy0LU!5e0!3m2!1ssr!2srs!4v1607464599171!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"arcata.jpg"
    }
    ,{
        "id":3,
        "name":"Fortuna",
        "description": ["Known as “the Friendly City within the Redwood Forest”, Fortuna is the perfect launching base for all day trips because of its central location within the county. Fortuna’s proximity to Humboldt Redwoods State Park, Avenue of the Giants, Victorian Village of Ferndale, and Eureka make it easy to call it home during your getaway.","Home to a host of lodging and dining options, Fortuna is ideal for any visitor looking for a relaxing change of pace. In the summer, the whole town blossoms with art, wine, chili and beer festivals and a host of events perfect for letting your hair down."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96970.74896852802!2d-124.21501582938616!3d40.57834034976136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d40a8b7db16ccf%3A0x33947768f4e3df6e!2z0KTQvtGA0YLRmNGD0L3QsCwg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607464658923!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"fortuna.jpg"
    }
    ,{
        "id":4,
        "name":"Ferndale",
        "description": ["Step back in time to the picture-perfect town of Ferndale, California. Nicknamed the Victorian Village for its fantastically preserved architecture, Ferndale is a vibrant, living postcard with a genuine welcoming feeling.","A still-thriving dairy industry led to the construction of Ferndale’s famous Victorian homes and gloriously ornate storefronts, some of the best in the West.  Transport yourself to a bygone era with a stroll down lamppost-lined Main Street, where you’ll find an authentic general store, candy shops, blacksmith, independent boutiques, saloons, and museums.","Ferndale pairs the best of the past with modern comforts and luxuries, from world-class accommodations to acclaimed restaurants, including some of the best historic lodging and dining options in the country. Explore the outdoors with a hike in Russ Park forest and bird sanctuary, just blocks from Main Street, or a visit to nearby Centerville Beach and the Lost Coast Headlands. A scenic setting amid peaceful farmland coupled with a convenient proximity to many of the activities and natural attractions in Humboldt County makes Ferndale the perfect place to stay during your redwoods vacation."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12120.926277594004!2d-124.2710597129046!3d40.58064366954073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d410e319d10add%3A0x5a64970b8a68f249!2z0KTQtdGA0L3QtNC10ZjQuywg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCA5NTUzNiwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607464740163!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"ferndale.jpg"
    },
    {
        "id":5,
        "name":"Trinidad",
        "description": ["Oh for the love of Trinidad! Entire romance novels are yet to be written about this tiny dot on the world map of love. Too poetic? Then you’ve never been here and now is the time. Your story is about to unfold.","Situated on the rugged Coast of Northern California, just a short 20 mile drive north of Eureka, this postage-stamp, picture-perfect town is perched on the cliffs above crashing waves. The gateway to the California Coastal National Monument, Trinidad promises tide pool exploration at Trinidad State Beach, leisurely hiking on Trinidad Head, and some crazy-good dining right on the Trinidad pier.","Shop for one-of-a-kind gifts, picnic supplies, or taste some wine if the mood strikes. Also, be sure the check out the Memorial Lighthouse and the Humboldt State Marine Lab. If you head home without visiting Trinidad… well, that will be one sad story to tell."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12033.800926080463!2d-124.15199876266882!3d41.059150168728564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d1410375051f91%3A0x5883f55bfe13ae9b!2z0KLRgNC40L3QuNC00LDQtCwg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCA5NTU3MCwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607464825148!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"trinidad.jpg"
    },
    {
        "id":6,
        "name":"County East",
        "description": ["East Humboldt County is the perfect Gateway to the rest of Humboldt County and all of it’s amazing offerings. At the heart of this picturesque region, you will find the world-renowned town of Willow Creek.","This where Bigfoot calls home. The rest of us are simply visitors. In addition to the China Flat Bigfoot Museum and the world’s largest collection of Bigfoot Artifacts, you will also find the very best of all that California’s mountains have to offer. Trinity River locals refer to it as, “River fun in the mountain sun.” Enjoy never-ending private swimming holes, rock jumping into deep pools (created by mother nature), and some of the California’s best whitewater rafting you’ll ever come across.","Some say that there’s so much to do in East Humboldt County, you might just decide to stay. You can even book a backcountry auto tour and get up close and personal with Six Rivers National Forest, enjoy a variety of wine tasting choices, sample the freshest produce from local farm stands, and as mentioned earlier… .share a little quality time with Bigfoot himself."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193101.0788722806!2d-123.7973835772853!3d40.86738926548989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d17dbb5ba267c3%3A0xaea52bec721079ca!2z0JLQuNC70L7RgyDQmtGA0LjQuiwg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607465088283!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"east.jpg"
    },
    {
        "id":7,
        "name":"County North",
        "description": ["Northern Humboldt County is riddled with natural attractions that will only intensify one’s wanderlust. It’s a paradise for everyone from the adventure seeker to the leisure lover, just don’t forget to bring your camera.","Home to ancient and mystical Redwood National Park and Prairie Creek State Park, here you’ll find some of the largest trees in the entire world by embarking on over 75 miles of hiking, biking, and self-guided nature trails. Next, let yourself journey to Fern Canyon through well-marked paths over babbling streams and intense forest growth… suddenly to come upon a hidden canyon cut deep into the mountainside – a filming location for Steven Spilberg’s Jurrasic Park 2.","Don’t leave the area without stopping by Ladybird Johnson Grove named after the former First Lady herself. An easy, two-mile loop that ushers travelers through an enchanted forest of staggeringly immense trees, mushrooms, and moss. Regardless of the specific adventures you choose, you’ll find no greater relaxation than when you transport yourself to Northern Humboldt County."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d384551.9579491405!2d-124.2014465!3d41.1495391!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d06636f5417fa5%3A0x36cf3266953b5f8e!2sRedwood%20National%20and%20State%20Parks!5e0!3m2!1ssr!2srs!4v1607465140295!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"north.jpg"
    },
    {
        "id":8,
        "name":"Southern Humboldt",
        "description": ["As children, we all heard the stories about distant magical lands where giants live. But unlike those stories, this is a true story. In Southern Humboldt County, real giants live ancient and towering high up into the clouds: the mighty old-growth redwoods.","Just a half-day north of San Francisco, right off Highway 101, you will find the Avenue of the Giants, a leisurely and winding drive where some of the most massive redwoods on the planet. Trailheads and side roads quietly beckon. Along the route, you might want to stop in Pepperwood, Weott, or Phillipsville for some picnic supply shopping. If you feel like driving through a real redwood, visit the Shrine Drive Thru Tree in Myers Flatt. Be sure to stop by the Humboldt Redwoods State Park visitor center as well as the Founders’ Grove and the Rockefeller Forest to enjoy a moment of silence beneath the world’s largest strand of old growth trees.","Don’t forget to check out Benbow, a quaint scenic valley with great lodging perched next to the scenic South Fork Eel River. Or Garberville, a perfect spring board to many of Humboldt’s greatest outdoor excursions. Lastly, you wouldn’t be doing your vacation justice without a memorable drive to the cozy little village of Shelter cove with views of the famous Lost Coast of California. Shelter Cove is home to the unusual beaches covered in black sand, life-filled tidepools, and a level of relaxation you just can’t find anywhere else. It’s no wonder they call it the Lost Coast."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d387382.47186998575!2d-124.2793608!3d40.6645914!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d463c73284e3b3%3A0x3716989f535a3fa!2sHumboldt%20Redwoods%20State%20Park!5e0!3m2!1ssr!2srs!4v1607465202775!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"southern.jpg"
    }
]


// SADRZAJ ZA AKTIVNOSTI

var Activities = [
    {"id":1,"image":{"src":"Redwood.jpg","alt":""},"name":"SHRINE DRIVE THRU TREE","description":"You know you’ve witnessed some of the largest trees on the planet when you find yourself driving your car through the very center of one. The Shrine and Drive-Over Tree (Myers Flat) allows you to return home again with photographs to prove you were not subject to ingesting some of the local forest mushrooms and did, indeed, pass directly through a living giant.","address":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975","directions":"https://www.google.com/maps/dir//13708+Avenue+of+the+Giants%2C+Myers+Flat%2C+CA+95554","locationID":8,"activityID":1},
    {"id":2,"image":{"src":"","alt":""},"name":"RHODODENDRON TRAIL","description":"To find the magic of the Rhododendron Trail you must first begin your journey at the Prairie Creek Visitor Center on the edge of scenic Elk Prairie. The trail is lined with lichen-encrusted maples, blackberry brambles, and magnificent redwoods. If you do anything in Humboldt make sure you don’t miss the beautiful scenery of the Rhododendron Trail.","address":"Prairie Creek Visitor Center, Newton B. Drury Scenic Parkway, Orick","number":"","directions":"https://www.google.com/maps/dir//Prairie+Creek+Visitor+Center%2C+Newton+B.+Drury+Scenic+Parkway%2C+Orick","locationID":7,"activityID":3},
    {"id":3,"image":{"src":"","alt":""},"name":"PATRICK’S POINT STATE PARK","description":"Patrick’s Point State Park is the perfect location to watch whales, sea lions, and beautiful sunsets. Appropriately located in the heart of the California redwood coast and considered one of the most magical treasures of the rugged Northern Coast. Take long and memorable strolls over safe, well-marked paths, bridges, steps and stairs winding in and around the crashing blue Pacific. Plus, get up close and personal in an ancient Sumeg village. A good camera is required on Rim Trail, Wedding Rock, Ceremonial Rock, and a never-ending display of why California is famous the world over.","address":"40630 CA-299, Willow Creek, CA 95573","number":"(530) 629-2263","directions":"https://www.google.com/maps/dir//4150+Patricks+Point+Drive%2C+Trinidad%2C+CA+95570","locationID":5,"activityID":2},
    {"id":4,"image":{"src":"","alt":""},"name":"BIGFOOT RAFTING","description":"Come join the Bigfoot Rafting family for river fun in the mountain sun! Bigfoot Rafting has been popular with tourist and locals alike since 1984, making them one of the largest and most experienced rafting company in Northern California. While they offer action-packed whitewater rafting to calm gentle floats safety always comes first. All guides are CPR, First Aid, and Swift Water Rescue certified. And there is no need to bring anything Bigfoot Rafting has all the gear and rafts you need. They even have a shuttle service that takes you to the rafting site.","address":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975","directions":"https://www.google.com/maps/dir//40630+CA-299%2C+Willow+Creek%2C+CA+95573","locationID":6,"activityID":4},
    {"id":5,"image":{"src":"","alt":""},"name":"WILLOW CREEK","description":"Come visit Bigfoot’s old stomping grounds. Where you can learn more about the hairy legend at the China Flat Bigfoot Museum with the world’s largest collection of Bigfoot artifacts. “River fun in the mountain sun” is a life motto here. Relax and enjoy never-ending private swimming holes, rock jumping into deep pools, and some of the best whitewater rafting you’ll ever experience.  There’s so much to do in Willow Creek, you’ll find yourself booking a trip to come back before you leave. You can even book a backcountry auto tour and get up close and personal with Six Rivers National Forest, enjoy a variety of wine tasting choices, sample the freshest produce from local farm stands, and as mentioned earlier…share a little quality-time with Bigfoot.","address":"Willow Creek, CA, USA","number":"","directions":"https://www.google.com/maps/dir//Willow+Creek%2C+CA%2C+USA","locationID":6,"activityID":5},
    {"id":6,"image":{"src":"","alt":""},"name":"FERNDALE MUSEUM","description":"An experience you can only get in Ferndale. This is a historical and educational museum that brings the community an appreciation and understanding of the culture and heritage of Ferndale, the Eel River and Mattole Valleys. The museum publishes a magazine, produce original documentary videos, conduct tours of historic houses and businesses, stage photography exhibits, publish original biographies and historic cookbooks, and maintain a constantly enriched and varied collection. The museum’s collections include a working seismograph, player piano, active blacksmith shop, and a vast display of artifacts that pertain to or were used by our forebears. We also assist our members in genealogical research, welcome visitors and new friends, and provide information on our two town cemeteries.","address":"515 Shaw Ave, Ferndale, CA 95536","number":"(707) 786-4466","directions":"https://www.google.com/maps/dir//515+Shaw+Ave%2C+Ferndale%2C+CA+95536","locationID":4,"activityID":6},
    {"id":7,"image":{"src":"","alt":""},"name":"PACIFIC OUTFITTERS ADVENTURE","description":"Pacific Outfitters has been a part of the Humboldt community for years and a one-stop-shop for all your outdoor needs and information in Humboldt . Their appreciation for the outdoors carries over to the products they sell and the service you’ll receive. In each store department, you will find some of the top local experts of the area and provide the advice you’re in search of. Customers come in and share stories and photos, sign up for classes, pick up useful tips, and become educated on the latest, leading edge gear for the outdoors. The staff is made up of outfitting specialists who hunt, fish, hike, bike, snowboard, dive, kayak, play disc golf, other outdoor sports.","address":"1600 5th Street, Eureka, CA 95501 ","number":"(707)-443-6328","directions":"https://www.google.com/maps/dir//1600+5th+Street%2C+Eureka%2C+CA+95501","locationID":1,"activityID":7},
    {"id":8,"image":{"src":"","alt":""},"name":"ARCATA MARSH & WILDLIFE SANCTUARY","description":"The Arcata Marsh and Wildlife Sanctuary is an internationally popular wetland system. If you enjoy bird watching all year round, this is the place for you. Located at the northern end of the Humboldt Bay, the sanctuary is set along the migration route for thousands of birds that head north to California, Mexico and South and Central America.","address":"569 South G Street, Arcata, CA 95521","number":"(707) 826-2359","directions":"https://www.google.com/maps/dir//569+South+G+Street%2C+Arcata%2C+CA+95521","locationID":2,"activityID":8},
    {"id":9,"image":{"src":"","alt":""},"name":"GRIZZLY CREEK REDWOODS STATE PARK","description":"Located on the Van Duzen River is the small yet beautiful Grizzly Creek Redwoods State Park. While the park only covers a few acres there are a number of things you can do, such as fishing, swimming, canoeing, and hiking. Very few visitors come on a weekday, so it is entirely possible to be the only person in the park.","address":"16949 State Highway 36, Carlotta, CA 95528","number":"(707)-777-3683","directions":"https://www.google.com/maps/dir//1600+5th+Street%2C+Eureka%2C+CA+95501","locationID":3,"activityID":1}
];

// SADRZAJ ZA SMESTAJ

var Lodging = [
    {"id":1,"name":"Cornelius Daly Inn","image":{"src":"","alt":"cornelius daly inn"},"price":130,"address":"1125 H Street, Eureka, CA 95501","number":"(707) 445-3638","directions":"https://www.google.com/maps/dir//1125+H+St,+Eureka,+CA+95501,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.7968961,-124.2322344,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d3ffd8efbc5419:0x4c451ecf9495c779!2m2!1d-124.1621945!2d40.7969173","locationID":1,"accTypeID":1},
    {"id":2,"name":"MAD RIVER RAPIDS RV PARK","image":{"src":"","alt":"mad river rapids rv park"},"price":42,"address":"3501 Janes Road, Arcata, CA 95521","number":"(707) 822-7275","directions":"https://www.google.com/maps/dir//3501+Janes+Rd,+Arcata,+CA+95521,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.9016469,-124.093386,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d150ab8aee0305:0xad53e93a0630388d!2m2!1d-124.0911973!2d40.9016469","locationID":2,"accTypeID":4},
    {"id":3,"name":"RIVERS'S EDGE RV PARK","image":{"src":"","alt":"River's Edge RV park"},"price":50,"address":"620 Davis Street, Rio Dell, CA","number":"(707) 764-5420","directions":"https://www.google.com/maps/dir//620+Davis+Street%2C+Rio+Dell%2C+CA","locationID":3,"accTypeID":2},
    {"id":4,"name":"VICTORIAN INN BOUTIQUE HOTEL","image":{"src":"","alt":""},"price":149,"address":"400 Ocean Avenue, Ferndale, CA 95536","number":"(707) 786-4949","directions":"https://www.google.com/maps/dir//400+Ocean+Avenue%2C+Ferndale%2C+CA+95536","locationID":4,"accTypeID":3},
    {"id":5,"name":"TURTLE ROCK OCEANFRONT INN","image":{"src":"","alt":"TURTLE ROCK OCEANFRONT INN"},"price":189,"address":"3392 Patricks Point Drive, Trinidad, CA 95570","number":"(707) 677-3707","directions":"https://www.google.com/maps/dir//3392+Patricks+Point+Drive%2C+Trinidad%2C+CA+95570","locationID":5,"accTypeID":3},
    {"id":6,"name":"DEAN CREEK RESDORT","image":{"src":"","alt":"dead creek resort"},"price":84,"address":"4112 Redwood Drive, Redway, CA 95542","number":"(707) 923-2555","directions":"https://www.google.com/maps/dir//4112+Redwood+Dr,+Redway,+CA+95560,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.1407506,-123.8125965,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d492c246cf94e1:0x170a3d6a5323fe91!2m2!1d-123.8104078!2d40.1407506","locationID":8,"accTypeID":3},
    {"id":7,"name":"COHO COTTAGES HOTEL","image":{"src":"","alt":"cogo cottages hotel"},"price":159,"address":"76 Willow Road, Willow Creek, CA 95573","number":"(530) 629-4000","directions":"https://www.google.com/maps/dir//76+Willow+Rd,+Willow+Creek,+CA+95573,+%D0%A1%D1%98%D0%B5%D0%B4%D0%B8%D1%9A%D0%B5%D0%BD%D0%B5+%D0%94%D1%80%D0%B6%D0%B0%D0%B2%D0%B5/@40.9412058,-123.6353805,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x54d3d835d44686b1:0x82027f9badf8ee96!2m2!1d-123.6331918!2d40.9412058","locationID":6,"accTypeID":3},
    {"id":8,"name":"GIANT REDWOODS RC & CAMP","image":{"src":"","alt":"GIANT REDWOODS RC & CAMP"},"price":35,"address":"400 Myers Avenue, Myers Flat, CA 95554","number":"(707) 943-9999","directions":"https://www.google.com/maps/dir//7+Valley+Green+Camp+Road%2C+Orick%2C+CA+95555","locationID":8,"accTypeID":4},
    {"id":9,"name":"ELK MEADOW VILLAGE IN REDWOOD NATIONAL PARK","image":{"src":"","alt":"elk meadow village, redwood national park"},"price":289,"address":"7 Valley Green Camp Road, Orick, CA 95555","number":"(866) 733-9637","directions":"https://www.google.com/maps/dir//7+Valley+Green+Camp+Road%2C+Orick%2C+CA+95555","locationID":7,"accTypeID":3},
];


// ***

// DODATNO

// ***


// ANIMATE METOD

function showActivity(){
    $(this).children().find(".hold").animate({"opacity":"1","transition":"opacity 0.7s"});
}
function hideActivity(){
    $(this).children().find(".hold").animate({"opacity":"0","transition":"opacity 0.4s"});
}

// Local Storage funkcionalnost

function RemmemberID(e){
    e.preventDefault();
    // alert(this.dataset.id);
    localStorage.setItem("ActivityID",this.dataset.id);
    window.location.href="activities.html";
}

// GLUPI CSS - hate it x(
function CSS(){
    let div =  document.getElementsByClassName("headline")[1];
    //console.log(div);
    div.style.padding="0px 60px 0px 0px";
}
